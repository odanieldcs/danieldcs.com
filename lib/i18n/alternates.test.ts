import { readdirSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from 'vitest'
import { mainNavigation } from '@/lib/navigation'
import {
  dynamicSegment,
  getAlternates,
  getLanguageSwitchHref,
  homePath,
  isCanonicalUrl,
  localizedPages,
} from './alternates'
import { htmlLang, type InterfaceLanguage, interfaceLanguages } from './types'

const samplePages = localizedPages.map((page) => ({
  ...page,
  pt: page.pt.replace(dynamicSegment, 'hello-world'),
  en: page.en.replace(dynamicSegment, 'hello-world'),
}))
const indexablePages = samplePages.filter((page) => page.indexable)
const selfCanonicalPages = samplePages.filter(
  (page) => !page.indexable && !('canonical' in page),
)
const crossCanonicalPages = samplePages.filter(
  (page): page is typeof page & { canonical: InterfaceLanguage } =>
    'canonical' in page,
)
const unpairedPathnames = [
  '/design-system',
  '/en/unknown',
  '/blog/hello-world/extra',
  // Starts with "en" but is not under /en.
  '/entrevistas',
]

test.each(indexablePages)('$pt ↔ $en has canonical and hreflang', (page) => {
  const languages = {
    [htmlLang.pt]: page.pt,
    [htmlLang.en]: page.en,
    'x-default': page.pt,
  }

  expect(getAlternates(page.pt)).toEqual({ canonical: page.pt, languages })
  expect(getAlternates(page.en)).toEqual({ canonical: page.en, languages })
})

test.each(selfCanonicalPages)(
  '$pt ↔ $en (switch only) has only its own canonical',
  (page) => {
    expect(getAlternates(page.pt)).toEqual({ canonical: page.pt })
    expect(getAlternates(page.en)).toEqual({ canonical: page.en })
  },
)

test.each(crossCanonicalPages)(
  '$pt ↔ $en canonicalizes to $canonical without hreflang',
  (page) => {
    const canonical = page[page.canonical]

    expect(getAlternates(page.pt)).toEqual({ canonical })
    expect(getAlternates(page.en)).toEqual({ canonical })
  },
)

test.each(unpairedPathnames)(
  '%s has no pair and returns only the canonical',
  (pathname) => {
    expect(getAlternates(pathname)).toEqual({ canonical: pathname })
  },
)

test.each([
  ...indexablePages.flatMap((page) => [page.pt, page.en]),
  ...selfCanonicalPages.flatMap((page) => [page.pt, page.en]),
  ...unpairedPathnames,
])('%s is its own canonical URL', (pathname) => {
  expect(isCanonicalUrl(pathname)).toBe(true)
})

test.each(crossCanonicalPages)(
  'only the $canonical URL of $pt ↔ $en is canonical',
  (page) => {
    for (const language of interfaceLanguages) {
      expect(isCanonicalUrl(page[language])).toBe(language === page.canonical)
    }
  },
)

test.each(samplePages)('$pt ↔ $en switch is reciprocal', (page) => {
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
  ['/blog/hello-world/', '/blog/hello-world'],
  ['/en/blog/hello-world?ref=feed#top', '/en/blog/hello-world'],
])('%s resolves like %s', (pathname, expected) => {
  expect(getAlternates(pathname)).toEqual(getAlternates(expected))
  expect(getLanguageSwitchHref(pathname, 'pt')).toBe(
    getLanguageSwitchHref(expected, 'pt'),
  )
  expect(isCanonicalUrl(pathname)).toBe(isCanonicalUrl(expected))
})

test('pages are unique, keep their language prefix, and share dynamic segments', () => {
  for (const language of interfaceLanguages) {
    const paths = localizedPages.map((page) => page[language])
    expect(new Set(paths).size).toBe(paths.length)
  }

  const enPrefix = /^\/en(\/|$)/
  for (const page of localizedPages) {
    expect(page.pt).not.toMatch(enPrefix)
    expect(page.en).toMatch(enPrefix)
    expect(page.en.match(dynamicSegment)).toEqual(page.pt.match(dynamicSegment))
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
