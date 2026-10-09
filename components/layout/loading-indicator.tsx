function classNames(...names: Array<string | undefined>) {
  return names.filter(Boolean).join(' ')
}

const loadingBarClassName = 'pointer-events-none h-1 max-h-1'

export function LoadingBar({
  phase,
  className = 'fixed inset-x-0 top-0 z-40',
}: {
  phase: 'loading' | 'complete'
  className?: string
}) {
  return (
    <div className={classNames(loadingBarClassName, className)} aria-hidden>
      <div className="navigation-progress-bar" data-phase={phase} />
    </div>
  )
}

const loadingStatusClassName =
  'pointer-events-none inline-flex max-w-[min(24rem,calc(100vw-2*var(--space-page)))] items-center gap-3 rounded-full border border-border bg-background px-4 py-2.5 text-caption text-foreground shadow-sm motion-safe:animate-page-in'

export function LoadingStatus({
  label,
  className = 'fixed right-page bottom-6 z-40',
}: {
  label: string
  className?: string
}) {
  return (
    <p role="status" className={classNames(loadingStatusClassName, className)}>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-5 shrink-0 motion-safe:animate-spin"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="opacity-25"
        />
        <path
          fill="currentColor"
          className="opacity-75"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {label}
    </p>
  )
}
