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

test('resolves labels for a language without exposing the other locale', () => {
  expect(getMainNavigationForLanguage('pt')).toEqual([
    { href: '/blog', label: 'Blog' },
    { href: '/community', label: 'Comunidade' },
    { href: '/about', label: 'Sobre' },
  ])
  expect(getMainNavigationForLanguage('en')).toEqual([
    { href: '/blog', label: 'Writing' },
    { href: '/community', label: 'Community' },
    { href: '/about', label: 'About' },
  ])
})
