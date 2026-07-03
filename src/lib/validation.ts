import type {
  AgentRun,
  AgentStep,
  RunStatus,
  StepStatus,
  StepType,
} from './types';

export interface ValidationResult {
  runs: AgentRun[];
  errors: string[];
  warnings: string[];
}

const RUN_STATUSES = new Set<RunStatus>(['completed', 'failed', 'partial']);
const STEP_STATUSES = new Set<StepStatus>(['success', 'failed', 'skipped']);
const STEP_TYPES = new Set<StepType>([
  'plan',
  'reasoning',
  'tool',
  'output',
  'error',
]);

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function asString(v: unknown, fallback: string): string {
  return typeof v === 'string' && v.length > 0 ? v : fallback;
}

function asNonNegativeNumber(v: unknown, fallback: number): number {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : fallback;
}

function asStringArray(v: unknown): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const filtered = v.filter((t): t is string => typeof t === 'string');
  return filtered.length > 0 ? filtered : undefined;
}

/**
 * Validate and normalize raw parsed JSON into AgentRun[].
 * Tolerant of missing/invalid fields: bad entries are skipped with a warning
 * rather than throwing. Returns fatal errors when the top-level shape is wrong.
 */
export function validateRunsData(raw: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isObject(raw)) {
    errors.push('Root data is not a JSON object.');
    return { runs: [], errors, warnings };
  }

  const runsRaw = raw.runs;
  if (!Array.isArray(runsRaw)) {
    errors.push('Missing or invalid "runs" array.');
    return { runs: [], errors, warnings };
  }

  const runs: AgentRun[] = [];

  runsRaw.forEach((r, i) => {
    if (!isObject(r)) {
      warnings.push(`Run #${i}: not an object; skipped.`);
      return;
    }
    const stepsRaw = r.steps;
    if (!Array.isArray(stepsRaw)) {
      warnings.push(
        `Run #${i} (${asString(r.id, '?')}): missing "steps" array; skipped.`,
      );
      return;
    }

    const steps: AgentStep[] = [];
    stepsRaw.forEach((s, j) => {
      if (!isObject(s)) {
        warnings.push(`Run #${i} step #${j}: not an object; skipped.`);
        return;
      }
      const status = asString(s.status, 'success');
      const type = asString(s.type, 'reasoning');
      const step: AgentStep = {
        id: asString(s.id, `step-${i}-${j}`),
        name: asString(s.name, '(unnamed step)'),
        type: STEP_TYPES.has(type as StepType) ? (type as StepType) : 'reasoning',
        status: STEP_STATUSES.has(status as StepStatus)
          ? (status as StepStatus)
          : 'success',
        startedAt: asString(s.startedAt, ''),
        endedAt: asString(s.endedAt, ''),
        durationMs: asNonNegativeNumber(s.durationMs, 0),
      };
      if (typeof s.tool === 'string') step.tool = s.tool;
      if (s.toolInput !== undefined) {
        step.toolInput = isObject(s.toolInput) ? s.toolInput : {};
      }
      if (s.toolOutput !== undefined) {
        step.toolOutput = typeof s.toolOutput === 'string' ? s.toolOutput : null;
      }
      if (typeof s.error === 'string') step.error = s.error;
      if (typeof s.message === 'string') step.message = s.message;
      steps.push(step);
    });

    const runStatus = asString(r.status, 'completed');
    const run: AgentRun = {
      id: asString(r.id, `run-${i}`),
      name: asString(r.name, '(unnamed run)'),
      agent: asString(r.agent, 'unknown'),
      model: asString(r.model, 'unknown'),
      startedAt: asString(r.startedAt, ''),
      endedAt: asString(r.endedAt, ''),
      status: RUN_STATUSES.has(runStatus as RunStatus)
        ? (runStatus as RunStatus)
        : 'completed',
      steps,
    };
    const tags = asStringArray(r.tags);
    if (tags) run.tags = tags;
    runs.push(run);
  });

  return { runs, errors, warnings };
}
