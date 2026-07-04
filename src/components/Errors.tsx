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
          className="rounded-card border border-red-200 bg-red-50/50 p-3 shadow-card"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-red-900 break-words">
              {step.name}
            </span>
            {step.tool ? (
              <span className="font-mono text-xs text-red-700">{step.tool}</span>
            ) : null}
            <StatusBadge status={step.status} className="ml-auto" />
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-red-700/80">
            <span className="font-mono">{formatTime(step.startedAt)}</span>
            <span>·</span>
            <span className="font-mono">{formatDuration(step.durationMs)}</span>
          </div>
          {step.error ? (
            <p className="mt-1.5 rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-900 break-words">
              {step.error}
            </p>
          ) : null}
          {step.message ? (
            <p className="mt-1 text-xs text-red-800/80 break-words">
              {step.message}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
