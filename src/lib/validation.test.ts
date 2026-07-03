import { describe, it, expect } from 'vitest';
import { validateRunsData } from './validation';

describe('validateRunsData', () => {
  it('rejects a non-object root', () => {
    const r = validateRunsData('hello');
    expect(r.runs).toEqual([]);
    expect(r.errors.length).toBeGreaterThan(0);
  });

  it('rejects a missing runs array', () => {
    const r = validateRunsData({ foo: 1 });
    expect(r.runs).toEqual([]);
    expect(r.errors.length).toBeGreaterThan(0);
  });

  it('accepts an empty runs array', () => {
    const r = validateRunsData({ runs: [] });
    expect(r.runs).toEqual([]);
    expect(r.errors).toEqual([]);
  });

  it('normalizes a valid run', () => {
    const r = validateRunsData({
      runs: [
        {
          id: 'r1',
          name: 't',
          status: 'completed',
          steps: [
            {
              id: 's1',
              name: 'p',
              type: 'tool',
              status: 'success',
              durationMs: 5,
              tool: 'x',
              toolInput: { a: 1 },
              toolOutput: 'ok',
            },
          ],
        },
      ],
    });
    expect(r.errors).toEqual([]);
    expect(r.runs).toHaveLength(1);
    expect(r.runs[0].steps[0].type).toBe('tool');
    expect(r.runs[0].steps[0].tool).toBe('x');
  });

  it('skips malformed runs with warnings instead of throwing', () => {
    const r = validateRunsData({
      runs: [
        { id: 'r1', steps: [{ id: 's1', status: 'success', durationMs: 1 }] },
        { id: 'r2' },
        'bad',
      ],
    });
    expect(r.runs).toHaveLength(1);
    expect(r.warnings.length).toBeGreaterThanOrEqual(2);
  });

  it('coerces unknown enum values and negative durations to safe defaults', () => {
    const r = validateRunsData({
      runs: [
        {
          id: 'r1',
          name: 'n',
          status: 'weird',
          steps: [
            {
              id: 's1',
              name: 'n',
              type: 'bogus',
              status: 'nope',
              durationMs: -5,
            },
          ],
        },
      ],
    });
    expect(r.runs[0].status).toBe('completed');
    expect(r.runs[0].steps[0].type).toBe('reasoning');
    expect(r.runs[0].steps[0].status).toBe('success');
    expect(r.runs[0].steps[0].durationMs).toBe(0);
  });
});
