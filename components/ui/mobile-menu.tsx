'use client'

import { useEffect, useId, useState } from 'react'
import { NavLink } from '@/components/ui/nav-link'

export type MobileMenuItem = {
  href: string
  label: string
}

type MobileMenuProps = {
  items: readonly MobileMenuItem[]
  triggerLabel: string
  navAriaLabel: string
}

export function MobileMenu({
  items,
  triggerLabel,
  navAriaLabel,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  useEffect(() => {
    if (!open) {
      return
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <div className="relative">
      <button
        type="button"
        className={[
          'inline-flex min-h-11 items-center rounded-md px-3 text-body font-medium text-foreground',
          'outline-none focus-visible:ring-2 focus-visible:ring-foreground/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        ].join(' ')}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {triggerLabel}
      </button>
      {open ? (
        <nav
          id={panelId}
          aria-label={navAriaLabel}
          className="absolute top-full right-0 z-10 mt-inline min-w-48 rounded-md border border-border bg-background p-inline shadow-sm"
        >
          <ul className="flex list-none flex-col gap-inline">
            {items.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} prefetch={false}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  )
}
