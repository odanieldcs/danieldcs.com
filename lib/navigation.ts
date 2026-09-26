import type { InterfaceLanguage } from '@/lib/i18n/types'

export type MainNavHref = '/blog' | '/community' | '/about'

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
    href: item.href,
    label: getMainNavLabel(item, lang),
  }))
}

export function getMainNavItem(href: MainNavHref): MainNavItem {
  const item = mainNavigation.find((entry) => entry.href === href)

  if (!item) {
    throw new Error(`Missing main navigation item for ${href}`)
  }

  return item
}
