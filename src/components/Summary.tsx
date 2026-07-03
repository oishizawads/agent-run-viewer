import type { AgentRun } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { formatDateTime, formatDuration } from '@/lib/format';
import {
  failedStepCount,
  skippedStepCount,
  stepCount,
  toolCallCount,
  totalDurationMs,
} from '@/lib/aggregate';

export function Summary({ run }: { run: AgentRun }) {
  const stats = [
    { label: 'Total duration', value: formatDuration(totalDurationMs(run)) },
    { label: 'Steps', value: String(stepCount(run)) },
    { label: 'Tool calls', value: String(toolCallCount(run)) },
    { label: 'Failed steps', value: String(failedStepCount(run)) },
    { label: 'Skipped steps', value: String(skippedStepCount(run)) },
  ];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={run.status} />
        <span className="text-xs text-slate-500">
          {run.agent} · {run.model}
        </span>
      </div>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-slate-200 bg-white p-3"
          >
            <dt className="text-xs text-slate-500">{s.label}</dt>
            <dd className="mt-1 text-lg font-semibold text-slate-900">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
      <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <Meta label="Started" value={formatDateTime(run.startedAt)} />
        <Meta label="Ended" value={formatDateTime(run.endedAt)} />
        <Meta label="Run ID" value={run.id} />
        <Meta
          label="Tags"
          value={run.tags && run.tags.length > 0 ? run.tags.join(', ') : '—'}
        />
      </dl>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-3">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-0.5 truncate font-medium text-slate-800">{value}</dd>
    </div>
  );
}
