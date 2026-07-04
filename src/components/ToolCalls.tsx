import type { AgentRun, AgentStep } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { EmptyState } from './EmptyState';
import { formatDuration, formatTime } from '@/lib/format';
import { perToolStats } from '@/lib/aggregate';

function safeJson(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function ToolCalls({ run }: { run: AgentRun }) {
  const toolSteps = run.steps.filter((s) => s.type === 'tool');
  const stats = perToolStats(run);

  if (toolSteps.length === 0) {
    return (
      <EmptyState
        title="No tool calls"
        message="This run did not record any tool invocations."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-card border border-[rgba(13,21,38,0.10)] shadow-card">
        <table className="min-w-full divide-y divide-[rgba(13,21,38,0.10)] text-sm">
          <thead className="bg-[#f6f7f9] text-left text-xs uppercase tracking-wide text-brand-muted">
            <tr>
              <th scope="col" className="px-3 py-2 font-semibold">Tool</th>
              <th scope="col" className="px-3 py-2 text-right font-semibold">Calls</th>
              <th scope="col" className="px-3 py-2 text-right font-semibold">Failed</th>
              <th scope="col" className="px-3 py-2 text-right font-semibold">Total time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(13,21,38,0.06)] bg-brand-surface">
            {stats.map((s) => (
              <tr key={s.tool}>
                <td className="px-3 py-2 font-mono text-brand-ink break-all">
                  {s.tool}
                </td>
                <td className="px-3 py-2 text-right font-mono text-brand-ink/80">{s.count}</td>
                <td className="px-3 py-2 text-right font-mono">
                  {s.failed > 0 ? (
                    <span className="font-semibold text-brand-error">{s.failed}</span>
                  ) : (
                    <span className="text-brand-muted/60">0</span>
                  )}
                </td>
                <td className="px-3 py-2 text-right font-mono text-brand-ink/80">
                  {formatDuration(s.totalDurationMs)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-2">
        {toolSteps.map((step, i) => (
          <ToolCallItem key={`${step.id}-${i}`} step={step} />
        ))}
      </ul>
    </div>
  );
}

function ToolCallItem({ step }: { step: AgentStep }) {
  const failed = step.status === 'failed';
  return (
    <li
      className={`rounded-card border p-3 shadow-card ${
        failed
          ? 'border-red-200 bg-red-50/50'
          : 'border-[rgba(13,21,38,0.10)] bg-brand-surface'
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-brand-accent-strong">{step.tool}</span>
        <span className="text-sm font-medium text-brand-ink break-words">
          {step.name}
        </span>
        <StatusBadge status={step.status} className="ml-auto" />
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-brand-muted">
        <span className="font-mono">{formatTime(step.startedAt)}</span>
        <span>·</span>
        <span className="font-mono">{formatDuration(step.durationMs)}</span>
      </div>
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
