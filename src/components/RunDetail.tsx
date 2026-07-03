'use client';

import type { AgentRun } from '@/lib/types';
import { Tabs, type TabDef } from './Tabs';
import { Summary } from './Summary';
import { Timeline } from './Timeline';
import { ToolCalls } from './ToolCalls';
import { Errors } from './Errors';
import { failedStepCount, toolCallCount } from '@/lib/aggregate';

export function RunDetail({ run }: { run: AgentRun }) {
  const failed = failedStepCount(run);
  const tools = toolCallCount(run);

  const tabs: TabDef[] = [
    { id: 'summary', label: 'Summary', content: <Summary run={run} /> },
    {
      id: 'timeline',
      label: <span>Timeline <span className="text-slate-400">({run.steps.length})</span></span>,
      content: <Timeline run={run} />,
    },
    {
      id: 'tools',
      label: <span>Tool Calls <span className="text-slate-400">({tools})</span></span>,
      content: <ToolCalls run={run} />,
    },
    {
      id: 'errors',
      label: (
        <span>
          Errors{' '}
          {failed > 0 ? (
            <span className="text-rose-500">({failed})</span>
          ) : (
            <span className="text-slate-400">(0)</span>
          )}
        </span>
      ),
      content: <Errors run={run} />,
    },
  ];

  return (
    <section className="space-y-4">
      <div className="min-w-0">
        <h2 className="truncate text-lg font-semibold text-slate-900">
          {run.name}
        </h2>
        <p className="truncate text-xs text-slate-500">
          {run.id} · {run.agent} · {run.model}
        </p>
      </div>
      <Tabs tabs={tabs} />
    </section>
  );
}
