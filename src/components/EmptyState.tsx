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
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
      <svg
        className="h-10 w-10 text-slate-300"
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
      <h3 className="mt-3 text-sm font-semibold text-slate-800">{title}</h3>
      {message ? (
        <p className="mt-1 max-w-md text-sm text-slate-500">{message}</p>
      ) : null}
      {error ? (
        <p className="mt-2 max-w-md text-xs text-rose-600 break-words">{error}</p>
      ) : null}
    </div>
  );
}
