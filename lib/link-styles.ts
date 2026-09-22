/** Shared anchor styling for MDX, nav, footer, etc. */
export const linkClassName = [
  'text-link',
  'underline decoration-border/70 underline-offset-[0.2em]',
  'transition-[color,text-decoration-color]',
  'hover:text-foreground hover:decoration-foreground/60',
  'rounded-sm',
  'outline-none focus-visible:ring-2 focus-visible:ring-foreground/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
].join(' ')
