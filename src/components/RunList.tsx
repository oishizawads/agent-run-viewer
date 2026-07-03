import type { AgentRun } from '@/lib/types';
import { RunCard } from './RunCard';

export function RunList({
  runs,
  selectedId,
  onSelect,
}: {
  runs: AgentRun[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}) {
  if (runs.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {runs.map((run) => (
        <RunCard
          key={run.id}
          run={run}
          active={run.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
