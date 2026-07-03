// Generates fake agent execution logs (data/runs.json).
// All data is synthetic. No real logs, no secrets, no PII.
// Run: node scripts/generate-sample-data.mjs
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

/** @typedef {{id:string,name:string,type:string,status:string,durationMs:number,tool?:string,toolInput?:Record<string,unknown>,toolOutput?:string|null,error?:string,message?:string}} StepDef */
/** @typedef {{id:string,name:string,agent:string,model:string,baseStartedAt:string,status:string,tags?:string[],steps:StepDef[]}} RunDef */

/** @type {RunDef[]} */
const runs = [
  {
    id: 'run-001',
    name: 'Research topic and write summary',
    agent: 'research-agent',
    model: 'agent-model-a',
    baseStartedAt: '2026-07-01T10:00:00Z',
    status: 'completed',
    tags: ['research', 'summary'],
    steps: [
      { id: 's1', name: 'Plan task', type: 'plan', status: 'success', durationMs: 2000, message: 'Decomposed task into search, read, and write steps.' },
      { id: 's2', name: 'Search documents', type: 'tool', status: 'success', durationMs: 7000, tool: 'search', toolInput: { query: 'renewable energy storage 2026' }, toolOutput: 'Returned 8 candidate documents.', message: 'Top results retrieved.' },
      { id: 's3', name: 'Read document 1', type: 'tool', status: 'success', durationMs: 9000, tool: 'read', toolInput: { docId: 'doc-1' }, toolOutput: 'Extracted 12 key points.', message: 'Read primary source.' },
      { id: 's4', name: 'Read document 2', type: 'tool', status: 'success', durationMs: 9000, tool: 'read', toolInput: { docId: 'doc-2' }, toolOutput: 'Extracted 7 key points.', message: 'Read secondary source.' },
      { id: 's5', name: 'Synthesize notes', type: 'reasoning', status: 'success', durationMs: 43000, message: 'Merged points into an outline.' },
      { id: 's6', name: 'Write summary', type: 'tool', status: 'success', durationMs: 20000, tool: 'write', toolInput: { path: 'out/summary.md' }, toolOutput: 'Wrote 540 words.', message: 'Drafted summary file.' },
      { id: 's7', name: 'Finalize', type: 'output', status: 'success', durationMs: 2000, message: 'Returned summary path to caller.' },
    ],
  },
  {
    id: 'run-002',
    name: 'Fetch and transform dataset',
    agent: 'data-agent',
    model: 'agent-model-b',
    baseStartedAt: '2026-07-01T11:20:00Z',
    status: 'failed',
    tags: ['data', 'etl'],
    steps: [
      { id: 's1', name: 'Plan task', type: 'plan', status: 'success', durationMs: 3000, message: 'Planned fetch then transform.' },
      { id: 's2', name: 'Fetch dataset', type: 'tool', status: 'success', durationMs: 11000, tool: 'fetch', toolInput: { source: 'public-feed' }, toolOutput: 'Downloaded 1,204 rows.', message: 'Dataset downloaded.' },
      { id: 's3', name: 'Validate schema', type: 'tool', status: 'failed', durationMs: 6000, tool: 'validate', toolInput: { schema: 'v2' }, toolOutput: null, error: "Schema mismatch: missing required field 'timestamp'.", message: 'Validation failed.' },
      { id: 's4', name: 'Transform dataset', type: 'tool', status: 'skipped', durationMs: 0, tool: 'transform', toolInput: { format: 'parquet' }, toolOutput: null, message: 'Skipped because validation failed.' },
      { id: 's5', name: 'Report failure', type: 'output', status: 'success', durationMs: 21000, message: 'Reported schema error to caller.' },
    ],
  },
  {
    id: 'run-003',
    name: 'Answer multi-part question',
    agent: 'qa-agent',
    model: 'agent-model-a',
    baseStartedAt: '2026-07-01T12:05:00Z',
    status: 'partial',
    tags: ['qa'],
    steps: [
      { id: 's1', name: 'Plan task', type: 'plan', status: 'success', durationMs: 4000, message: 'Split into 3 sub-questions.' },
      { id: 's2', name: 'Look up fact A', type: 'tool', status: 'success', durationMs: 8000, tool: 'lookup', toolInput: { key: 'fact-a' }, toolOutput: 'Found authoritative value.', message: 'Resolved sub-question 1.' },
      { id: 's3', name: 'Look up fact B', type: 'tool', status: 'failed', durationMs: 7000, tool: 'lookup', toolInput: { key: 'fact-b' }, toolOutput: null, error: "No matching entry found for 'fact-b'.", message: 'Sub-question 2 unresolved.' },
      { id: 's4', name: 'Look up fact C', type: 'tool', status: 'success', durationMs: 9000, tool: 'lookup', toolInput: { key: 'fact-c' }, toolOutput: 'Found authoritative value.', message: 'Resolved sub-question 3.' },
      { id: 's5', name: 'Compose answer', type: 'reasoning', status: 'success', durationMs: 42000, message: 'Composed answer with a gap noted for fact B.' },
      { id: 's6', name: 'Emit answer', type: 'output', status: 'success', durationMs: 5000, message: 'Returned partial answer to caller.' },
    ],
  },
  {
    id: 'run-004',
    name: 'Batch classify 24 items',
    agent: 'classify-agent',
    model: 'agent-model-c',
    baseStartedAt: '2026-07-01T13:40:00Z',
    status: 'completed',
    tags: ['batch', 'classify'],
    steps: [
      { id: 's1', name: 'Plan batch', type: 'plan', status: 'success', durationMs: 2000, message: 'Planned 24 classify calls.' },
      ...Array.from({ length: 24 }, (_, i) => ({
        id: `s${i + 2}`,
        name: `Classify item ${i + 1}`,
        type: 'tool',
        status: i === 13 ? 'failed' : 'success',
        durationMs: 5800,
        tool: 'classify',
        toolInput: { item: i + 1 },
        toolOutput: i === 13 ? null : `label-${(i % 3) + 1}`,
        error: i === 13 ? 'Classifier timed out for item 14.' : undefined,
        message: i === 13 ? 'Item 14 failed; retried once and skipped.' : `Classified item ${i + 1}.`,
      })),
      { id: 's26', name: 'Finalize batch', type: 'output', status: 'success', durationMs: 2000, message: 'Returned 23 labels and 1 skip.' },
    ],
  },
];

function iso(baseIso, offsetMs) {
  const t = new Date(baseIso).getTime() + offsetMs;
  return new Date(t).toISOString();
}

const out = { runs: runs.map((r) => {
  let cursor = 0;
  const steps = r.steps.map((s) => {
    const startedAt = iso(r.baseStartedAt, cursor);
    const endedAt = iso(r.baseStartedAt, cursor + s.durationMs);
    cursor += s.durationMs;
    const step = {
      id: s.id,
      name: s.name,
      type: s.type,
      status: s.status,
      startedAt,
      endedAt,
      durationMs: s.durationMs,
    };
    if (s.tool) step.tool = s.tool;
    if (s.toolInput) step.toolInput = s.toolInput;
    if (s.toolOutput !== undefined) step.toolOutput = s.toolOutput;
    if (s.error) step.error = s.error;
    if (s.message) step.message = s.message;
    return step;
  });
  return {
    id: r.id,
    name: r.name,
    agent: r.agent,
    model: r.model,
    startedAt: r.baseStartedAt,
    endedAt: iso(r.baseStartedAt, cursor),
    status: r.status,
    tags: r.tags,
    steps,
  };
}) };

const dest = path.join(import.meta.dirname, '..', 'data', 'runs.json');
await mkdir(path.dirname(dest), { recursive: true });
await writeFile(dest, JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log(`[generate-sample-data] Wrote ${out.runs.length} runs (${out.runs.reduce((n, r) => n + r.steps.length, 0)} steps) to ${path.relative(process.cwd(), dest)}.`);
