import Link from 'next/link'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type NavLinkOptions = {
  active?: boolean
}

/** Header navigation — 13px, medium, ink at 70% until hover or the current route. */
export function navLinkClassName({ active = false }: NavLinkOptions = {}) {
  return [
    'text-nav rounded-sm',
    'outline-none focus-visible:ring-2 focus-visible:ring-foreground/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'transition-colors hover:text-foreground',
    active ? 'text-foreground' : 'text-foreground/70',
  ].join(' ')
}

type NavLinkProps = {
  active?: boolean
  className?: string
  children?: ReactNode
} & ComponentPropsWithoutRef<typeof Link>

export function NavLink({
  active = false,
  className,
  children,
  ...rest
}: NavLinkProps) {
  const classes = [navLinkClassName({ active }), className]
    .filter(Boolean)
    .join(' ')

  return (
    <Link className={classes} {...rest}>
      {children}
    </Link>
  )
}
