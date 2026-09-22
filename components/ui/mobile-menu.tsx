'use client'

import { useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/button'
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

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      {open ? (
        <path d="M6 6l12 12M18 6 6 18" />
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  )
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

    // The document scrolls on <html>. Fixing the body keeps the page still
    // under the overlay; overflow on both nodes hides the scrollbar.
    const scrollY = window.scrollY
    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousPosition = document.body.style.position
    const previousTop = document.body.style.top
    const previousWidth = document.body.style.width

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.position = previousPosition
      document.body.style.top = previousTop
      document.body.style.width = previousWidth
      document.removeEventListener('keydown', onKeyDown)
      window.scrollTo(0, scrollY)
    }
  }, [open])

  return (
    <>
      <Button
        variant="ghost"
        className="relative z-30 min-w-11 px-0"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={triggerLabel}
        onClick={() => setOpen((value) => !value)}
      >
        <MenuIcon open={open} />
      </Button>
      {open
        ? createPortal(
            <nav
              id={panelId}
              aria-label={navAriaLabel}
              className="fixed inset-0 z-10 overflow-y-auto bg-background px-page pt-24"
            >
              <ul className="mx-auto flex w-full max-w-container list-none flex-col gap-inline">
                {items.map((item) => (
                  <li key={item.href}>
                    <NavLink
                      href={item.href}
                      prefetch={false}
                      className="inline-flex min-h-11 items-center"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>,
            document.body,
          )
        : null}
    </>
  )
}
