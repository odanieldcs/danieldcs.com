export const textLinkCtaClassName = [
  'group inline-flex w-fit items-center gap-2 text-sm font-semibold text-accent',
  'rounded-sm hover:underline',
  'outline-hidden focus-visible:ring-2 focus-visible:ring-foreground/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
].join(' ')

export const textLinkRetryButtonClassName = [
  textLinkCtaClassName,
  'cursor-pointer border-0 bg-transparent p-0',
].join(' ')
