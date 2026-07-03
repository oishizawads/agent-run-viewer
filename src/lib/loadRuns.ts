import { validateRunsData, type ValidationResult } from './validation';

export type LoadStatus = 'loading' | 'ok' | 'error';

export interface LoadResult extends ValidationResult {
  status: LoadStatus;
}

/**
 * Fetch and validate the runs JSON at runtime.
 * Never throws: broken JSON, network errors, and bad shapes all become
 * a structured LoadResult with status "error" and an empty runs array so
 * the UI can render an empty/error state instead of crashing.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export async function loadRuns(url = `${BASE_PATH}/data/runs.json`): Promise<LoadResult> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return {
        status: 'error',
        runs: [],
        errors: [`HTTP ${res.status} when fetching ${url}`],
        warnings: [],
      };
    }
    const text = await res.text();
    let raw: unknown;
    try {
      raw = JSON.parse(text);
    } catch (e) {
      return {
        status: 'error',
        runs: [],
        errors: [
          `Failed to parse JSON: ${e instanceof Error ? e.message : 'unknown error'}`,
        ],
        warnings: [],
      };
    }
    const result = validateRunsData(raw);
    return {
      status: result.errors.length > 0 ? 'error' : 'ok',
      ...result,
    };
  } catch (e) {
    return {
      status: 'error',
      runs: [],
      errors: [
        `Network error: ${e instanceof Error ? e.message : 'unknown error'}`,
      ],
      warnings: [],
    };
  }
}
