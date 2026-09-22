import { expect, test } from 'vitest'
import {
  getMainNavItem,
  getMainNavigationForLanguage,
  getMainNavLabel,
  mainNavigation,
} from './navigation'

test('main navigation has exactly the four V1 sitemap routes', () => {
  expect(mainNavigation).toHaveLength(4)
  expect(mainNavigation.map((item) => item.href)).toEqual([
    '/blog',
    '/community',
    '/trilha',
    '/about',
  ])
})

test('does not include a Home item', () => {
  const hrefs: string[] = mainNavigation.map((item) => item.href)
  expect(hrefs).not.toContain('/')
})

test('Trilha keeps the same label in pt and en', () => {
  const trilha = getMainNavItem('/trilha')

  expect(trilha.label.pt).toBe('Trilha')
  expect(trilha.label.en).toBe('Trilha')
  expect(getMainNavLabel(trilha, 'pt')).toBe('Trilha')
  expect(getMainNavLabel(trilha, 'en')).toBe('Trilha')
})

test('resolves labels for a language without exposing the other locale', () => {
  expect(getMainNavigationForLanguage('pt')).toEqual([
    { href: '/blog', label: 'Blog' },
    { href: '/community', label: 'Comunidade' },
    { href: '/trilha', label: 'Trilha' },
    { href: '/about', label: 'Sobre' },
  ])
  expect(getMainNavigationForLanguage('en')).toEqual([
    { href: '/blog', label: 'Writing' },
    { href: '/community', label: 'Community' },
    { href: '/trilha', label: 'Trilha' },
    { href: '/about', label: 'About' },
  ])
})
