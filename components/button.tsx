import Link from 'next/link'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'outline' | 'ghost'
type ButtonShape = 'rounded' | 'pill'

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

const chromeClass = [
  'inline-flex min-h-11 items-center justify-center',
  'text-body font-medium',
  'transition-colors',
  'outline-none focus-visible:ring-2 focus-visible:ring-foreground/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  'disabled:cursor-not-allowed',
].join(' ')

type ButtonClassNameOptions = {
  variant?: ButtonVariant
  shape?: ButtonShape
  className?: string
}

export function buttonClassName({
  variant = 'primary',
  shape = 'rounded',
  className,
}: ButtonClassNameOptions = {}) {
  const radius = shape === 'pill' ? 'rounded-full' : 'rounded-md'

  return [chromeClass, radius, variantClass[variant], className]
    .filter(Boolean)
    .join(' ')
}

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
  return (
    <button
      type={type}
      className={buttonClassName({ variant, className })}
      {...rest}
    >
      {children}
    </button>
  )
}

type ButtonLinkProps = {
  variant?: ButtonVariant
  shape?: ButtonShape
  className?: string
  children?: ReactNode
} & ComponentPropsWithoutRef<typeof Link>

export function ButtonLink({
  variant = 'primary',
  shape = 'rounded',
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={buttonClassName({ variant, shape, className })} {...rest}>
      {children}
    </Link>
  )
}
