import type { AgentStep, StepType } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { formatDuration, formatTime } from '@/lib/format';

const TYPE_LABEL: Record<StepType, string> = {
  plan: 'plan',
  reasoning: 'reasoning',
  tool: 'tool',
  output: 'output',
  error: 'error',
};

// Chart palette order (design-system §1.2): teal, blue, amber, pink, violet, slate
const TYPE_CLASSES: Record<StepType, string> = {
  plan: 'bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-700/20',
  reasoning: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/20',
  tool: 'bg-teal-50 text-brand-accent-strong ring-1 ring-inset ring-teal-700/20',
  output: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-700/20',
  error: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-700/20',
};

function safeJson(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function TimelineStep({ step }: { step: AgentStep }) {
  const failed = step.status === 'failed';
  return (
    <li
      className={`relative rounded-card border p-3 pl-4 shadow-card ${
        failed
          ? 'border-red-200 bg-red-50/50'
          : 'border-[rgba(13,21,38,0.10)] bg-brand-surface'
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute left-0 top-3 bottom-3 w-1 rounded-full ${
          failed ? 'bg-brand-error' : 'bg-brand-accent/30'
        }`}
      />
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${TYPE_CLASSES[step.type]}`}
        >
          {TYPE_LABEL[step.type]}
        </span>
        <span className="text-sm font-medium text-brand-ink break-words">
          {step.name}
        </span>
        <StatusBadge status={step.status} className="ml-auto" />
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-brand-muted">
        <span className="font-mono">{formatTime(step.startedAt)}</span>
        <span>·</span>
        <span className="font-mono">{formatDuration(step.durationMs)}</span>
        {step.tool ? (
          <>
            <span>·</span>
            <span className="font-mono text-brand-ink/70">{step.tool}</span>
          </>
        ) : null}
      </div>
      {step.message ? (
        <p className="mt-1.5 text-sm text-brand-muted break-words">
          {step.message}
        </p>
      ) : null}
      {failed && step.error ? (
        <p className="mt-1.5 rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800 break-words">
          {step.error}
        </p>
      ) : null}
      {step.toolInput !== undefined ? (
        <details className="mt-2">
          <summary className="cursor-pointer text-xs text-brand-muted hover:text-brand-ink">
            Input
          </summary>
          <pre className="mt-1 max-w-full overflow-hidden whitespace-pre-wrap break-words rounded bg-[#f6f7f9] p-2 font-mono text-xs text-brand-ink/80">
            {safeJson(step.toolInput)}
          </pre>
        </details>
      ) : null}
      {step.toolOutput ? (
        <details className="mt-1">
          <summary className="cursor-pointer text-xs text-brand-muted hover:text-brand-ink">
            Output
          </summary>
          <pre className="mt-1 max-w-full overflow-hidden whitespace-pre-wrap break-words rounded bg-[#f6f7f9] p-2 font-mono text-xs text-brand-ink/80">
            {step.toolOutput}
          </pre>
        </details>
      ) : null}
    </li>
  );
}
