// not-sr-only sets position: static and fights with fixed. Reset the clip on focus.
const skipLinkClassName = [
  'sr-only fixed z-50 bg-background text-sm font-medium text-foreground',
  'outline-hidden focus-visible:ring-2 focus-visible:ring-foreground/35',
  'focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  'focus-visible:fixed focus-visible:top-4 focus-visible:left-4',
  'focus-visible:m-0 focus-visible:h-auto focus-visible:w-auto',
  'focus-visible:overflow-visible focus-visible:px-4 focus-visible:py-2',
  'focus-visible:whitespace-normal focus-visible:rounded-md',
  'focus-visible:[clip-path:none]',
].join(' ')

export function SkipLink({ label }: { label: string }) {
  return (
    <a href="#conteudo" className={skipLinkClassName}>
      {label}
    </a>
  )
}
