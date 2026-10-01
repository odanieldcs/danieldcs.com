import { expect, test } from 'vitest'
import { getMainNavigationForLanguage, mainNavigation } from './navigation'

test('main navigation has exactly the three public routes', () => {
  expect(mainNavigation).toHaveLength(3)
  expect(mainNavigation.map((item) => item.href)).toEqual([
    '/blog',
    '/community',
    '/about',
  ])
})

test('does not include a Home item', () => {
  const hrefs: string[] = mainNavigation.map((item) => item.href)
  expect(hrefs).not.toContain('/')
})

test('resolves labels and localized hrefs for a language', () => {
  expect(getMainNavigationForLanguage('pt')).toEqual([
    { href: '/blog', label: 'Blog' },
    { href: '/community', label: 'Comunidade' },
    { href: '/about', label: 'Sobre' },
  ])
  expect(getMainNavigationForLanguage('en')).toEqual([
    { href: '/en/blog', label: 'Writing' },
    { href: '/en/community', label: 'Community' },
    { href: '/en/about', label: 'About' },
  ])
})
