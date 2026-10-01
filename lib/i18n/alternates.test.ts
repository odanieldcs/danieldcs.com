import { readdirSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from 'vitest'
import { mainNavigation } from '@/lib/navigation'
import {
  getAlternates,
  getLanguageSwitchHref,
  homePath,
  localizedPages,
} from './alternates'
import { htmlLang, type InterfaceLanguage, interfaceLanguages } from './types'

const indexablePages = localizedPages.filter((page) => page.indexable)
const switchOnlyPages = localizedPages.filter((page) => !page.indexable)
const unpairedPathnames = ['/blog/hello-world', '/design-system', '/en/unknown']

test.each(indexablePages)('$pt ↔ $en has canonical and hreflang', (page) => {
  const languages = {
    [htmlLang.pt]: page.pt,
    [htmlLang.en]: page.en,
    'x-default': page.pt,
  }

  expect(getAlternates(page.pt)).toEqual({ canonical: page.pt, languages })
  expect(getAlternates(page.en)).toEqual({ canonical: page.en, languages })
})

test.each(switchOnlyPages)(
  '$pt ↔ $en (noindex) has only the canonical',
  (page) => {
    expect(getAlternates(page.pt)).toEqual({ canonical: page.pt })
    expect(getAlternates(page.en)).toEqual({ canonical: page.en })
  },
)

test.each(unpairedPathnames)(
  '%s has no pair and returns only the canonical',
  (pathname) => {
    expect(getAlternates(pathname)).toEqual({ canonical: pathname })
  },
)

test.each(localizedPages)('$pt ↔ $en switch is reciprocal', (page) => {
  expect(getLanguageSwitchHref(page.pt, 'en')).toBe(page.en)
  expect(getLanguageSwitchHref(page.en, 'pt')).toBe(page.pt)
  expect(getLanguageSwitchHref(page.pt, 'pt')).toBe(page.pt)
  expect(getLanguageSwitchHref(page.en, 'en')).toBe(page.en)
})

test.each(unpairedPathnames)(
  '%s switch falls back to the home of the target language',
  (pathname) => {
    expect(getLanguageSwitchHref(pathname, 'en')).toBe(homePath.en)
    expect(getLanguageSwitchHref(pathname, 'pt')).toBe(homePath.pt)
  },
)

test.each([
  ['/blog/', '/blog'],
  ['/blog?page=2&view=list', '/blog'],
  ['/about#contact', '/about'],
  ['/en//', '/en'],
])('%s resolves like %s', (pathname, expected) => {
  expect(getAlternates(pathname)).toEqual(getAlternates(expected))
  expect(getLanguageSwitchHref(pathname, 'pt')).toBe(
    getLanguageSwitchHref(expected, 'pt'),
  )
})

test('pages are unique and each language keeps its own prefix', () => {
  for (const language of interfaceLanguages) {
    const paths = localizedPages.map((page) => page[language])
    expect(new Set(paths).size).toBe(paths.length)
  }

  const enPrefix = /^\/en(\/|$)/
  for (const page of localizedPages) {
    expect(page.pt).not.toMatch(enPrefix)
    expect(page.en).toMatch(enPrefix)
  }
})

test('every main navigation page has a PT/EN pair', () => {
  const ptPaths = localizedPages.map((page) => page.pt)

  for (const { href } of mainNavigation) {
    expect(ptPaths).toContain(href)
  }
})

const appDir = path.resolve(import.meta.dirname, '../../app')

/** Routes served by the `app/(<language>)` group, with route groups removed. */
function routesOf(language: InterfaceLanguage): Set<string> {
  const pageFiles = readdirSync(path.join(appDir, `(${language})`), {
    recursive: true,
    encoding: 'utf8',
  }).filter((file) => path.basename(file) === 'page.tsx')

  return new Set(
    pageFiles.map((file) => {
      const segments = path
        .dirname(file)
        .split(path.sep)
        .filter((segment) => segment !== '.' && !/^\(.+\)$/.test(segment))

      return `/${segments.join('/')}`
    }),
  )
}

test.each(interfaceLanguages)(
  'every %s path in the map has a page',
  (language) => {
    const routes = routesOf(language)

    for (const page of localizedPages) {
      expect(routes, `missing page for ${page[language]}`).toContain(
        page[language],
      )
    }
  },
)
