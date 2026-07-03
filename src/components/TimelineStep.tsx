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

const TYPE_CLASSES: Record<StepType, string> = {
  plan: 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/20',
  reasoning: 'bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-600/20',
  tool: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20',
  output: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
  error: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20',
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
      className={`relative rounded-lg border p-3 pl-4 ${
        failed
          ? 'border-rose-200 bg-rose-50/50'
          : 'border-slate-200 bg-white'
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute left-0 top-3 bottom-3 w-1 rounded-full ${
          failed ? 'bg-rose-500' : 'bg-slate-200'
        }`}
      />
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${TYPE_CLASSES[step.type]}`}
        >
          {TYPE_LABEL[step.type]}
        </span>
        <span className="text-sm font-medium text-slate-900 break-words">
          {step.name}
        </span>
        <StatusBadge status={step.status} className="ml-auto" />
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
        <span>{formatTime(step.startedAt)}</span>
        <span>·</span>
        <span>{formatDuration(step.durationMs)}</span>
        {step.tool ? (
          <>
            <span>·</span>
            <span className="font-mono text-slate-600">{step.tool}</span>
          </>
        ) : null}
      </div>
      {step.message ? (
        <p className="mt-1.5 text-sm text-slate-600 break-words">
          {step.message}
        </p>
      ) : null}
      {failed && step.error ? (
        <p className="mt-1.5 rounded bg-rose-100 px-2 py-1 text-xs font-medium text-rose-800 break-words">
          {step.error}
        </p>
      ) : null}
      {step.toolInput !== undefined ? (
        <details className="mt-2">
          <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-700">
            Input
          </summary>
          <pre className="mt-1 max-w-full overflow-hidden whitespace-pre-wrap break-words rounded bg-slate-50 p-2 text-xs text-slate-700">
            {safeJson(step.toolInput)}
          </pre>
        </details>
      ) : null}
      {step.toolOutput ? (
        <details className="mt-1">
          <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-700">
            Output
          </summary>
          <pre className="mt-1 max-w-full overflow-hidden whitespace-pre-wrap break-words rounded bg-slate-50 p-2 text-xs text-slate-700">
            {step.toolOutput}
          </pre>
        </details>
      ) : null}
    </li>
  );
}
