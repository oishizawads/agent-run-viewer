import type { AgentRun, AgentStep } from './types';

export function stepCount(run: AgentRun): number {
  return run.steps.length;
}

export function failedStepCount(run: AgentRun): number {
  return run.steps.filter((s) => s.status === 'failed').length;
}

export function skippedStepCount(run: AgentRun): number {
  return run.steps.filter((s) => s.status === 'skipped').length;
}

export function toolCallCount(run: AgentRun): number {
  return run.steps.filter((s) => s.type === 'tool').length;
}

/**
 * Wall-clock duration of a run. Falls back to the sum of step durations
 * when run-level timestamps are missing or invalid.
 */
export function totalDurationMs(run: AgentRun): number {
  const start = Date.parse(run.startedAt);
  const end = Date.parse(run.endedAt);
  if (!Number.isNaN(start) && !Number.isNaN(end) && end >= start) {
    return end - start;
  }
  return run.steps.reduce((sum, s) => sum + (s.durationMs || 0), 0);
}

export interface ToolStat {
  tool: string;
  count: number;
  failed: number;
  totalDurationMs: number;
}

export function perToolStats(run: AgentRun): ToolStat[] {
  const map = new Map<string, ToolStat>();
  for (const s of run.steps) {
    if (s.type !== 'tool' || !s.tool) continue;
    const stat = map.get(s.tool) ?? {
      tool: s.tool,
      count: 0,
      failed: 0,
      totalDurationMs: 0,
    };
    stat.count += 1;
    if (s.status === 'failed') stat.failed += 1;
    stat.totalDurationMs += s.durationMs || 0;
    map.set(s.tool, stat);
  }
  return [...map.values()].sort(
    (a, b) => b.count - a.count || a.tool.localeCompare(b.tool),
  );
}

export function failedSteps(run: AgentRun): AgentStep[] {
  return run.steps.filter((s) => s.status === 'failed');
}

/**
 * Steps ordered by start time. Entries with missing/equal timestamps keep
 * their original relative order (stable sort).
 */
export function timelineSteps(run: AgentRun): AgentStep[] {
  return [...run.steps].sort((a, b) => {
    const ta = Date.parse(a.startedAt);
    const tb = Date.parse(b.startedAt);
    if (!Number.isNaN(ta) && !Number.isNaN(tb) && ta !== tb) return ta - tb;
    return 0;
  });
}
