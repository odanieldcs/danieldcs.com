'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  useInterfaceLanguage,
  useUiDictionary,
} from '@/components/interface-language-provider'
import {
  SlidingHighlight,
  useSlidingHighlight,
} from '@/components/layout/sliding-highlight'
import { MobileMenu } from '@/components/ui/mobile-menu'
import { NavLink } from '@/components/ui/nav-link'
import { getMainNavigationForLanguage } from '@/lib/navigation'

function isMainNavActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`)
}

const desktopNavLinkClassName =
  'relative z-10 inline-flex items-center rounded-md! px-4 py-2.5'

export function HeaderNavLinks({ pathname }: { pathname: string | null }) {
  const { language } = useInterfaceLanguage()
  const dictionary = useUiDictionary()
  const items = getMainNavigationForLanguage(language)
  const [hoveredHref, setHoveredHref] = useState<string | null>(null)
  const activeHref =
    pathname === null
      ? null
      : (items.find((item) => isMainNavActive(pathname, item.href))?.href ??
        null)
  const { containerRef, box, instant } = useSlidingHighlight<HTMLElement>(
    hoveredHref ?? activeHref,
  )

  return (
    <nav
      ref={containerRef}
      aria-label={dictionary.mobileMenu.navAriaLabel}
      className="relative hidden items-center gap-1 md:flex"
      onMouseLeave={() => setHoveredHref(null)}
    >
      <SlidingHighlight box={box} instant={instant} />
      {items.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          active={pathname !== null && isMainNavActive(pathname, item.href)}
          className={desktopNavLinkClassName}
          data-highlight-target={item.href}
          onMouseEnter={() => setHoveredHref(item.href)}
          data-cta="nav_item"
          data-cta-location="header"
          data-cta-target={item.ctaTarget}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export function HeaderNav() {
  return <HeaderNavLinks pathname={usePathname()} />
}

export function HeaderMobileMenu() {
  const { language } = useInterfaceLanguage()
  const { mobileMenu } = useUiDictionary()

  return (
    <MobileMenu
      items={getMainNavigationForLanguage(language)}
      triggerLabel={mobileMenu.trigger}
      navAriaLabel={mobileMenu.navAriaLabel}
    />
  )
}
