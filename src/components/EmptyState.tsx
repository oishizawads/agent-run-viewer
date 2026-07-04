export function EmptyState({
  title,
  message,
  error,
}: {
  title: string;
  message?: string;
  error?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-[rgba(13,21,38,0.20)] bg-white px-6 py-12 text-center">
      <svg
        className="h-10 w-10 text-[rgba(13,21,38,0.20)]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h6m-6 4h6m-7 4h8a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <h3 className="mt-3 font-display text-sm font-semibold text-brand-ink">{title}</h3>
      {message ? (
        <p className="mt-1 max-w-md text-sm text-brand-muted">{message}</p>
      ) : null}
      {error ? (
        <p className="mt-2 max-w-md text-xs text-brand-error break-words">{error}</p>
      ) : null}
    </div>
  );
}
