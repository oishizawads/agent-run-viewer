import { describe, it, expect } from 'vitest';
import {
  failedStepCount,
  perToolStats,
  skippedStepCount,
  stepCount,
  timelineSteps,
  toolCallCount,
  totalDurationMs,
} from './aggregate';
import type { AgentRun } from './types';

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
      type: 'plan',
      status: 'success',
      startedAt: '2026-07-01T10:00:00Z',
      endedAt: '2026-07-01T10:00:02Z',
      durationMs: 2000,
    },
    {
      id: 's2',
      name: 'a',
      type: 'tool',
      status: 'success',
      startedAt: '2026-07-01T10:00:02Z',
      endedAt: '2026-07-01T10:00:09Z',
      durationMs: 7000,
      tool: 'search',
    },
    {
      id: 's3',
      name: 'b',
      type: 'tool',
      status: 'failed',
      startedAt: '2026-07-01T10:00:09Z',
      endedAt: '2026-07-01T10:00:15Z',
      durationMs: 6000,
      tool: 'search',
      error: 'boom',
    },
    {
      id: 's4',
      name: 'c',
      type: 'tool',
      status: 'skipped',
      startedAt: '2026-07-01T10:00:15Z',
      endedAt: '2026-07-01T10:00:15Z',
      durationMs: 0,
      tool: 'write',
    },
    {
      id: 's5',
      name: 'd',
      type: 'reasoning',
      status: 'success',
      startedAt: '2026-07-01T10:00:15Z',
      endedAt: '2026-07-01T10:01:30Z',
      durationMs: 75000,
    },
  ],
};

describe('aggregate', () => {
  it('counts steps', () => {
    expect(stepCount(run)).toBe(5);
  });

  it('counts failed steps', () => {
    expect(failedStepCount(run)).toBe(1);
  });

  it('counts skipped steps', () => {
    expect(skippedStepCount(run)).toBe(1);
  });

  it('counts tool calls', () => {
    expect(toolCallCount(run)).toBe(3);
  });

  it('uses wall-clock duration when timestamps are valid', () => {
    expect(totalDurationMs(run)).toBe(90000);
  });

  it('falls back to sum of step durations when timestamps are missing', () => {
    const r2: AgentRun = { ...run, startedAt: '', endedAt: '' };
    expect(totalDurationMs(r2)).toBe(2000 + 7000 + 6000 + 0 + 75000);
  });

  it('aggregates per-tool stats sorted by count desc', () => {
    const stats = perToolStats(run);
    expect(stats).toHaveLength(2);
    expect(stats[0].tool).toBe('search');
    expect(stats[0].count).toBe(2);
    expect(stats[0].failed).toBe(1);
    expect(stats[0].totalDurationMs).toBe(13000);
    expect(stats[1].tool).toBe('write');
    expect(stats[1].count).toBe(1);
  });

  it('orders timeline steps by start time', () => {
    const ids = timelineSteps(run).map((s) => s.id);
    expect(ids).toEqual(['s1', 's2', 's3', 's4', 's5']);
  });

  it('does not call tools without a tool name', () => {
    const noTools: AgentRun = {
      ...run,
      steps: run.steps.filter((s) => s.type !== 'tool'),
    };
    expect(toolCallCount(noTools)).toBe(0);
    expect(perToolStats(noTools)).toEqual([]);
  });
});
