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

// Semantic colors aligned to design-system §1.2:
// success #15803d / error #b91c1c / warn #b45309
const TONE_CLASSES: Record<Tone, string> = {
  success: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-700/20',
  failed: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-700/20',
  partial: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-700/20',
  skipped:
    'bg-[rgba(13,21,38,0.05)] text-brand-muted ring-1 ring-inset ring-[rgba(13,21,38,0.12)]',
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
      className={`inline-flex items-center rounded-chip px-2.5 py-0.5 text-xs font-medium capitalize ${TONE_CLASSES[tone]} ${className}`}
    >
      {label}
    </span>
  );
}
