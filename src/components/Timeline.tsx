import type { AgentRun } from '@/lib/types';
import { TimelineStep } from './TimelineStep';
import { timelineSteps } from '@/lib/aggregate';
import { EmptyState } from './EmptyState';

export function Timeline({ run }: { run: AgentRun }) {
  const steps = timelineSteps(run);
  if (steps.length === 0) {
    return (
      <EmptyState
        title="No steps recorded"
        message="This run has no steps in its log."
      />
    );
  }
  return (
    <ol className="space-y-2">
      {steps.map((step, i) => (
        <TimelineStep key={`${step.id}-${i}`} step={step} />
      ))}
    </ol>
  );
}
