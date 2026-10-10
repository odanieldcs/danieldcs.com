'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { NavLink } from '@/components/ui/nav-link'

export type MobileMenuItem = {
  href: string
  label: string
  ctaTarget: string
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
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement>(null)

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
        triggerRef.current?.focus()
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

  useEffect(() => {
    if (!open) {
      return
    }

    const panel = panelRef.current
    const touched: HTMLElement[] = []

    for (const child of document.body.children) {
      if (!(child instanceof HTMLElement)) continue
      if (child === panel || child.tagName === 'HEADER') continue
      if (child.inert) continue
      child.inert = true
      touched.push(child)
    }

    panel?.querySelector('a')?.focus({ preventScroll: true })

    return () => {
      for (const child of touched) {
        child.inert = false
      }
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      return
    }

    // `48rem` is the `md` breakpoint. The trigger is `md:hidden`, so closing
    // here must not move focus onto it.
    const media = window.matchMedia('(min-width: 48rem)')

    function onChange(event: MediaQueryListEvent) {
      if (event.matches) {
        setOpen(false)
      }
    }

    if (media.matches) {
      setOpen(false)
      return
    }

    media.addEventListener('change', onChange)
    return () => {
      media.removeEventListener('change', onChange)
    }
  }, [open])

  return (
    <>
      <Button
        ref={triggerRef}
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
              ref={panelRef}
              id={panelId}
              aria-label={navAriaLabel}
              className="fixed inset-0 z-10 overflow-y-auto bg-background px-page pt-28"
            >
              <ul className="mx-auto flex w-full max-w-container list-none flex-col gap-inline">
                {items.map((item) => (
                  <li key={item.href}>
                    <NavLink
                      href={item.href}
                      className="inline-flex min-h-11 items-center"
                      onClick={() => setOpen(false)}
                      data-cta="nav_item"
                      data-cta-location="header"
                      data-cta-target={item.ctaTarget}
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
