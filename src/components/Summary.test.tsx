import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Summary } from './Summary';
import type { AgentRun } from '@/lib/types';

const run: AgentRun = {
  id: 'r1',
  name: 'test run',
  agent: 'a',
  model: 'm',
  startedAt: '2026-07-01T10:00:00Z',
  endedAt: '2026-07-01T10:01:30Z',
  status: 'partial',
  steps: [
    {
      id: 's1',
      name: 'plan',
      type: 'tool',
      status: 'success',
      startedAt: '2026-07-01T10:00:00Z',
      endedAt: '2026-07-01T10:00:05Z',
      durationMs: 5000,
      tool: 'search',
    },
    {
      id: 's2',
      name: 'fail',
      type: 'tool',
      status: 'failed',
      startedAt: '2026-07-01T10:00:05Z',
      endedAt: '2026-07-01T10:00:10Z',
      durationMs: 5000,
      tool: 'search',
      error: 'boom',
    },
  ],
};

describe('Summary', () => {
  it('renders the run status and aggregate stats', () => {
    render(<Summary run={run} />);
    expect(screen.getByText('Total duration')).toBeInTheDocument();
    expect(screen.getByText('1m 30s')).toBeInTheDocument();
    expect(screen.getByText('Steps')).toBeInTheDocument();
    expect(screen.getByText('Tool calls')).toBeInTheDocument();
    expect(screen.getByText('Failed steps')).toBeInTheDocument();
    expect(screen.getByText('partial')).toBeInTheDocument();
  });

  it('reports the failed step count', () => {
    render(<Summary run={run} />);
    const failedCell = screen.getByText('Failed steps').closest('dt');
    const value = failedCell?.nextElementSibling;
    expect(value).toHaveTextContent('1');
  });
});
