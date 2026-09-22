import Link from 'next/link'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type NavLinkOptions = {
  active?: boolean
}

/** Navigation anchor styling — link tokens without a permanent underline. */
export function navLinkClassName({ active = false }: NavLinkOptions = {}) {
  return [
    'text-body text-link',
    'transition-colors hover:text-foreground',
    'rounded-sm',
    'outline-none focus-visible:ring-2 focus-visible:ring-foreground/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    active ? 'font-medium text-foreground' : '',
  ]
    .filter(Boolean)
    .join(' ')
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
