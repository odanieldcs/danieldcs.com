'use client'

import { usePathname } from 'next/navigation'
import {
  useInterfaceLanguage,
  useUiDictionary,
} from '@/components/interface-language-provider'
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
