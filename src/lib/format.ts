function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

/** Human-readable duration from milliseconds. */
export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return '—';
  if (ms < 1000) return `${Math.round(ms)}ms`;
  const totalSec = ms / 1000;
  if (totalSec < 60) {
    const decimals = totalSec < 10 ? 2 : 1;
    return `${totalSec.toFixed(decimals)}s`;
  }
  const totalMin = Math.floor(totalSec / 60);
  const remSec = Math.round(totalSec - totalMin * 60);
  if (totalMin < 60) return `${totalMin}m ${pad(remSec)}s`;
  const totalHr = Math.floor(totalMin / 60);
  const remMin = totalMin - totalHr * 60;
  return `${totalHr}h ${pad(remMin)}m`;
}

/** Deterministic UTC date-time string (avoids locale/hydration drift). */
export function formatDateTime(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(
    d.getUTCDate(),
  )} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(
    d.getUTCSeconds(),
  )}Z`;
}

/** Deterministic UTC time string. */
export function formatTime(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(
    d.getUTCSeconds(),
  )}Z`;
}
