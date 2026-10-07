import { localizePath } from '@/lib/i18n/routes'
import type { InterfaceLanguage } from '@/lib/i18n/types'

export type MainNavHref = '/blog' | '/community' | '/about'

export type NavItemTarget = MainNavHref extends `/${infer Segment}`
  ? Segment
  : never

export function navItemTarget(href: MainNavHref): NavItemTarget {
  return href.slice(1) as NavItemTarget
}

export type MainNavItem = {
  href: MainNavHref
  label: Record<InterfaceLanguage, string>
}

export const mainNavigation: readonly MainNavItem[] = [
  { href: '/blog', label: { pt: 'Blog', en: 'Writing' } },
  { href: '/community', label: { pt: 'Comunidade', en: 'Community' } },
  { href: '/about', label: { pt: 'Sobre', en: 'About' } },
]

export function getMainNavLabel(
  item: MainNavItem,
  lang: InterfaceLanguage,
): string {
  return item.label[lang]
}

export function getMainNavigationForLanguage(lang: InterfaceLanguage) {
  return mainNavigation.map((item) => ({
    href: localizePath(item.href, lang),
    label: getMainNavLabel(item, lang),
    ctaTarget: navItemTarget(item.href),
  }))
}

export function getMainNavItem(href: MainNavHref): MainNavItem {
  const item = mainNavigation.find((entry) => entry.href === href)

  if (!item) {
    throw new Error(`Missing main navigation item for ${href}`)
  }

  return item
}
