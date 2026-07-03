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
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th scope="col" className="px-3 py-2 font-medium">Tool</th>
              <th scope="col" className="px-3 py-2 text-right font-medium">Calls</th>
              <th scope="col" className="px-3 py-2 text-right font-medium">Failed</th>
              <th scope="col" className="px-3 py-2 text-right font-medium">Total time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {stats.map((s) => (
              <tr key={s.tool}>
                <td className="px-3 py-2 font-mono text-slate-800 break-all">
                  {s.tool}
                </td>
                <td className="px-3 py-2 text-right text-slate-700">{s.count}</td>
                <td className="px-3 py-2 text-right">
                  {s.failed > 0 ? (
                    <span className="font-medium text-rose-600">{s.failed}</span>
                  ) : (
                    <span className="text-slate-400">0</span>
                  )}
                </td>
                <td className="px-3 py-2 text-right text-slate-700">
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
      className={`rounded-lg border p-3 ${
        failed ? 'border-rose-200 bg-rose-50/50' : 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-slate-600">{step.tool}</span>
        <span className="text-sm font-medium text-slate-900 break-words">
          {step.name}
        </span>
        <StatusBadge status={step.status} className="ml-auto" />
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
        <span>{formatTime(step.startedAt)}</span>
        <span>·</span>
        <span>{formatDuration(step.durationMs)}</span>
      </div>
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
