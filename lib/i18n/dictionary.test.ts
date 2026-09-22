import { expect, test } from 'vitest'
import {
  getMainNavItem,
  getMainNavigationForLanguage,
  getMainNavLabel,
} from '@/lib/navigation'
import { getDictionary } from './dictionary'

test('pt and en dictionaries share the same key shape', () => {
  const pt = getDictionary('pt')
  const en = getDictionary('en')

  expect(Object.keys(pt)).toEqual(Object.keys(en))
  expect(Object.keys(pt.nav)).toEqual(['blog', 'community', 'trilha', 'about'])
  expect(Object.keys(en.nav)).toEqual(Object.keys(pt.nav))
  expect(Object.keys(pt.theme)).toEqual(['toggle', 'lightMode', 'darkMode'])
  expect(Object.keys(en.theme)).toEqual(Object.keys(pt.theme))
  expect(Object.keys(pt.language)).toEqual([
    'label',
    'switchToPt',
    'switchToEn',
  ])
  expect(Object.keys(en.language)).toEqual(Object.keys(pt.language))
  expect(Object.keys(pt.mobileMenu)).toEqual(['trigger', 'navAriaLabel'])
  expect(Object.keys(en.mobileMenu)).toEqual(Object.keys(pt.mobileMenu))
})

test('nav labels match doc 4 in Portuguese', () => {
  expect(getDictionary('pt').nav).toEqual({
    blog: 'Blog',
    community: 'Comunidade',
    trilha: 'Trilha',
    about: 'Sobre',
  })
})

test('nav labels match doc 4 in English', () => {
  expect(getDictionary('en').nav).toEqual({
    blog: 'Writing',
    community: 'Community',
    trilha: 'Trilha',
    about: 'About',
  })
})

test('nav dictionary is derived from mainNavigation', () => {
  const pt = getDictionary('pt')
  const en = getDictionary('en')

  expect(pt.nav.blog).toBe(getMainNavLabel(getMainNavItem('/blog'), 'pt'))
  expect(en.nav.blog).toBe(getMainNavLabel(getMainNavItem('/blog'), 'en'))
  expect(getMainNavigationForLanguage('pt').map((item) => item.label)).toEqual(
    Object.values(pt.nav),
  )
  expect(getMainNavigationForLanguage('en').map((item) => item.label)).toEqual(
    Object.values(en.nav),
  )
})

test('includes theme, language switch, and mobile menu copy in both languages', () => {
  const pt = getDictionary('pt')
  const en = getDictionary('en')

  expect(pt.theme.toggle).toBe('Tema')
  expect(en.theme.toggle).toBe('Theme')
  expect(pt.theme.lightMode).toBe('Modo claro')
  expect(en.theme.darkMode).toBe('Dark mode')
  expect(pt.language.label).toBe('Idioma')
  expect(en.language.label).toBe('Language')
  expect(pt.language.switchToEn).toBe('Mudar para inglês')
  expect(en.language.switchToPt).toBe('Switch to Portuguese')
  expect(pt.mobileMenu.trigger).toBe('Menu')
  expect(en.mobileMenu.navAriaLabel).toBe('Main navigation')
})
