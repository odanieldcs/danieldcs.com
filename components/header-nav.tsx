'use client'

import { usePathname } from 'next/navigation'
import {
  useInterfaceLanguage,
  useUiDictionary,
} from '@/components/interface-language-provider'
import { MobileMenu } from '@/components/ui/mobile-menu'
import { NavLink } from '@/components/ui/nav-link'
import { getMainNavigationForLanguage } from '@/lib/navigation'

function isMainNavActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function HeaderNavLinks({ pathname }: { pathname: string | null }) {
  const { language } = useInterfaceLanguage()
  const dictionary = useUiDictionary()
  const items = getMainNavigationForLanguage(language)

  return (
    <nav
      aria-label={dictionary.mobileMenu.navAriaLabel}
      className="hidden items-center gap-content-gap md:flex"
    >
      {items.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          active={pathname !== null && isMainNavActive(pathname, item.href)}
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
