import { readdirSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, test } from 'vitest'
import {
  getAlternates,
  getLanguageSwitchHref,
  localizedPages,
  normalizePathname,
} from './alternates'
import { interfaceLanguages } from './types'

const indexablePages = localizedPages.filter((page) => page.indexable)
const switchOnlyPages = localizedPages.filter((page) => !page.indexable)

describe('getAlternates', () => {
  test.each(indexablePages)('$pt ↔ $en has canonical and hreflang', (page) => {
    const languages = { 'pt-BR': page.pt, en: page.en, 'x-default': page.pt }

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

  test.each(['/blog/hello-world', '/design-system', '/en/unknown'])(
    '%s has no pair and returns only the canonical',
    (pathname) => {
      expect(getAlternates(pathname)).toEqual({ canonical: pathname })
    },
  )

  test('normalizes the pathname before resolving', () => {
    expect(getAlternates('/blog/?page=2#top')).toEqual(getAlternates('/blog'))
    expect(getAlternates('/en/')).toEqual(getAlternates('/en'))
  })
})

describe('getLanguageSwitchHref', () => {
  test.each(localizedPages)('$pt ↔ $en is reciprocal', (page) => {
    expect(getLanguageSwitchHref(page.pt, 'en')).toBe(page.en)
    expect(getLanguageSwitchHref(page.en, 'pt')).toBe(page.pt)
    expect(
      getLanguageSwitchHref(getLanguageSwitchHref(page.pt, 'en'), 'pt'),
    ).toBe(page.pt)
    expect(getLanguageSwitchHref(page.pt, 'pt')).toBe(page.pt)
    expect(getLanguageSwitchHref(page.en, 'en')).toBe(page.en)
  })

  test.each(['/blog/hello-world', '/design-system', '/en/unknown'])(
    '%s falls back to the home of the target language',
    (pathname) => {
      expect(getLanguageSwitchHref(pathname, 'en')).toBe('/en')
      expect(getLanguageSwitchHref(pathname, 'pt')).toBe('/')
    },
  )

  test('normalizes the pathname before resolving', () => {
    expect(getLanguageSwitchHref('/about/?ref=nav', 'en')).toBe('/en/about')
  })
})

test.each([
  ['/', '/'],
  ['/blog/', '/blog'],
  ['/blog?page=2&view=list', '/blog'],
  ['/about#contact', '/about'],
  ['/en//', '/en'],
])('normalizePathname(%s) is %s', (input, expected) => {
  expect(normalizePathname(input)).toBe(expected)
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

const appDir = path.join(process.cwd(), 'app')

/** Routes served by the `app/(<language>)` group, with route groups removed. */
function routesOf(language: string): Set<string> {
  const groupDir = path.join(appDir, `(${language})`)
  const pageFiles = readdirSync(groupDir, {
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
