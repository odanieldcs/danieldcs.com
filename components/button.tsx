import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'outline' | 'ghost'

const variantClass: Record<ButtonVariant, string> = {
  primary: [
    'bg-foreground px-4 text-background',
    'hover:bg-foreground/90',
    'disabled:bg-muted disabled:text-background/80',
  ].join(' '),
  outline: [
    'border border-border bg-transparent px-4 text-foreground',
    'hover:bg-foreground/5',
    'disabled:border-border/60 disabled:text-muted',
  ].join(' '),
  ghost: [
    'bg-transparent text-foreground',
    'hover:bg-foreground/5',
    'disabled:text-muted',
  ].join(' '),
}

const baseClass = [
  'inline-flex min-h-11 items-center justify-center rounded-md',
  'text-body font-medium',
  'transition-colors',
  'outline-none focus-visible:ring-2 focus-visible:ring-foreground/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  'disabled:cursor-not-allowed',
].join(' ')

type ButtonProps = {
  variant?: ButtonVariant
  className?: string
  children?: ReactNode
} & ComponentPropsWithoutRef<'button'>

export function Button({
  variant = 'primary',
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = [baseClass, variantClass[variant], className]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  )
}
