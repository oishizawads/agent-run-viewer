import type { AgentRun } from '@/lib/types';
import { EmptyState } from './EmptyState';
import { StatusBadge } from './StatusBadge';
import { formatDuration, formatTime } from '@/lib/format';
import { failedSteps } from '@/lib/aggregate';

export function Errors({ run }: { run: AgentRun }) {
  const failures = failedSteps(run);
  if (failures.length === 0) {
    return (
      <EmptyState
        title="No errors"
        message="Every step in this run succeeded or was skipped."
      />
    );
  }
  return (
    <ul className="space-y-2">
      {failures.map((step, i) => (
        <li
          key={`${step.id}-${i}`}
          className="rounded-lg border border-rose-200 bg-rose-50/50 p-3"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-rose-900 break-words">
              {step.name}
            </span>
            {step.tool ? (
              <span className="font-mono text-xs text-rose-700">{step.tool}</span>
            ) : null}
            <StatusBadge status={step.status} className="ml-auto" />
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-rose-700/80">
            <span>{formatTime(step.startedAt)}</span>
            <span>·</span>
            <span>{formatDuration(step.durationMs)}</span>
          </div>
          {step.error ? (
            <p className="mt-1.5 rounded bg-rose-100 px-2 py-1 text-xs font-medium text-rose-900 break-words">
              {step.error}
            </p>
          ) : null}
          {step.message ? (
            <p className="mt-1 text-xs text-rose-800/80 break-words">
              {step.message}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
