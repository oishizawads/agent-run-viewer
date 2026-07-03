import type { RunStatus, StepStatus } from '@/lib/types';

export type Tone = 'success' | 'failed' | 'partial' | 'skipped';

export function statusTone(status: string): Tone {
  switch (status) {
    case 'completed':
    case 'success':
      return 'success';
    case 'failed':
      return 'failed';
    case 'partial':
      return 'partial';
    case 'skipped':
      return 'skipped';
    default:
      return 'skipped';
  }
}

const TONE_CLASSES: Record<Tone, string> = {
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
  failed: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20',
  partial: 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-600/20',
  skipped: 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20',
};

export function StatusBadge({
  status,
  className = '',
}: {
  status: RunStatus | StepStatus | string;
  className?: string;
}) {
  const tone = statusTone(status);
  const label = status || 'unknown';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${TONE_CLASSES[tone]} ${className}`}
    >
      {label}
    </span>
  );
}
