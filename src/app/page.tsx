'use client';

import { useEffect, useMemo, useState } from 'react';
import { loadRuns, type LoadResult } from '@/lib/loadRuns';
import { RunList } from '@/components/RunList';
import { RunDetail } from '@/components/RunDetail';
import { EmptyState } from '@/components/EmptyState';

export default function Page() {
  const [result, setResult] = useState<LoadResult>({
    status: 'loading',
    runs: [],
    errors: [],
    warnings: [],
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadRuns().then((r) => {
      if (!cancelled) setResult(r);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const selected = useMemo(
    () => result.runs.find((r) => r.id === selectedId) ?? null,
    [result, selectedId],
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-accent">
            AI Observability
          </p>
          <h1 className="font-display text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
            Agent Run Viewer
          </h1>
          <p className="mt-1 text-sm text-brand-muted">
            Step-by-step timeline, tool calls, and errors for AI agent runs.
          </p>
        </div>
        <span className="inline-flex items-center rounded-chip border border-[rgba(13,21,38,0.10)] bg-white px-2.5 py-0.5 text-xs font-medium text-brand-muted">
          Sample data
        </span>
      </header>

      {result.status === 'loading' ? <Loading /> : null}

      {result.status === 'error' ? (
        <EmptyState
          title="Could not load runs"
          message="The run log could not be loaded. Check that the JSON file exists and is valid."
          error={result.errors[0]}
        />
      ) : null}

      {result.status === 'ok' && result.runs.length === 0 ? (
        <EmptyState
          title="No runs available"
          message="The log file loaded successfully but contains no runs."
        />
      ) : null}

      {result.status === 'ok' && result.runs.length > 0 ? (
        selected ? (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-link hover:text-brand-accent focus:outline-none focus-visible:underline"
            >
              <span aria-hidden="true">←</span> All runs
            </button>
            <RunDetail run={selected} />
          </div>
        ) : (
          <div className="space-y-4">
            {result.warnings.length > 0 ? (
              <p className="rounded-btn border border-[rgba(180,83,9,0.2)] bg-amber-50 px-3 py-2 text-xs text-brand-warn">
                {result.warnings.length} entr
                {result.warnings.length === 1 ? 'y was' : 'ies were'} skipped
                while parsing. First issue: {result.warnings[0]}
              </p>
            ) : null}
            <RunList
              runs={result.runs}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
        )
      ) : null}

      <footer className="mt-10 border-t border-[rgba(13,21,38,0.10)] pt-4">
        <p className="text-xs text-brand-muted">
          Synthetic data demo — logs are generated samples, no real agent data or secrets are used.
        </p>
        <p className="mt-1 text-xs">
          <a
            href="https://oishizawads.github.io/portfolio-hub/"
            className="font-semibold text-brand-accent-strong hover:underline"
          >
            ← Portfolio Hub
          </a>
          <span className="mx-2 text-brand-muted">·</span>
          <span className="text-brand-muted">
            Data from <code className="font-mono text-xs">/data/runs.json</code>
          </span>
        </p>
      </footer>
    </main>
  );
}

function Loading() {
  return (
    <div className="flex items-center justify-center rounded-card border border-[rgba(13,21,38,0.10)] bg-brand-surface px-6 py-12 text-sm text-brand-muted shadow-card">
      <svg
        className="mr-2 h-4 w-4 animate-spin text-brand-accent"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      Loading runs…
    </div>
  );
}
