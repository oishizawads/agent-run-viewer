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
      label: <span>Timeline <span className="font-mono text-brand-muted/70">({run.steps.length})</span></span>,
      content: <Timeline run={run} />,
    },
    {
      id: 'tools',
      label: <span>Tool Calls <span className="font-mono text-brand-muted/70">({tools})</span></span>,
      content: <ToolCalls run={run} />,
    },
    {
      id: 'errors',
      label: (
        <span>
          Errors{' '}
          {failed > 0 ? (
            <span className="font-mono text-brand-error">({failed})</span>
          ) : (
            <span className="font-mono text-brand-muted/70">(0)</span>
          )}
        </span>
      ),
      content: <Errors run={run} />,
    },
  ];

  return (
    <section className="space-y-4">
      <div className="min-w-0">
        <h2 className="truncate font-display text-lg font-semibold text-brand-ink">
          {run.name}
        </h2>
        <p className="truncate text-xs text-brand-muted">
          {run.id} · {run.agent} · {run.model}
        </p>
      </div>
      <Tabs tabs={tabs} />
    </section>
  );
}
