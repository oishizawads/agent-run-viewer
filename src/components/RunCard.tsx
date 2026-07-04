import type { AgentRun } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { formatDateTime, formatDuration } from '@/lib/format';
import {
  failedStepCount,
  stepCount,
  toolCallCount,
  totalDurationMs,
} from '@/lib/aggregate';

export function RunCard({
  run,
  active = false,
  onSelect,
}: {
  run: AgentRun;
  active?: boolean;
  onSelect?: (id: string) => void;
}) {
  const failed = failedStepCount(run);
  const tools = toolCallCount(run);
  const duration = totalDurationMs(run);
  return (
    <button
      type="button"
      onClick={() => onSelect?.(run.id)}
      aria-pressed={active}
      className={`group w-full rounded-card border p-4 text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
        active
          ? 'border-brand-accent bg-[#f0fdfa] shadow-card'
          : 'border-[rgba(13,21,38,0.10)] bg-brand-surface shadow-card hover:-translate-y-0.5 hover:shadow-hover'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-display text-sm font-semibold text-brand-ink">
            {run.name}
          </h3>
          <p className="mt-0.5 truncate text-xs text-brand-muted">
            {run.id} · {run.agent}
          </p>
        </div>
        <StatusBadge status={run.status} />
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <Stat label="Duration" value={formatDuration(duration)} />
        <Stat label="Steps" value={String(stepCount(run))} />
        <Stat label="Tools" value={String(tools)} />
      </dl>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-brand-muted">
        <span>{formatDateTime(run.startedAt)}</span>
        {failed > 0 ? (
          <span className="font-medium text-brand-error">{failed} failed</span>
        ) : null}
      </div>
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-brand-muted">{label}</dt>
      <dd className="truncate font-mono font-semibold text-brand-ink">{value}</dd>
    </div>
  );
}
