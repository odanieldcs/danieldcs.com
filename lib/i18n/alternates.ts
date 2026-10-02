import type { Metadata } from 'next'
import { localizePath } from './routes'
import {
  DEFAULT_INTERFACE_LANGUAGE,
  htmlLang,
  type InterfaceLanguage,
} from './types'

type LocalizedPaths = Readonly<Record<InterfaceLanguage, string>>

type IndexablePage = LocalizedPaths & {
  /** Both URLs are canonical and expose hreflang. */
  readonly indexable: true
}

type SwitchOnlyPage = LocalizedPaths & {
  /** Keeps the pair for the language switch only, with no hreflang. */
  readonly indexable: false
  /** Both URLs canonicalize to this language. Omit it to keep each URL canonical. */
  readonly canonical?: InterfaceLanguage
}

type LocalizedPage = IndexablePage | SwitchOnlyPage

export const localizedPages = [
  { pt: '/', en: '/en', indexable: true },
  { pt: '/blog', en: '/en/blog', indexable: true },
  { pt: '/community', en: '/en/community', indexable: true },
  { pt: '/about', en: '/en/about', indexable: true },
  { pt: '/trilha', en: '/en/trilha', indexable: false },
  // `[slug]` matches one segment and carries over to the other language.
  // Posts are PT-only: both URLs canonicalize to the PT path, with no hreflang.
  // When posts are translated, drop `canonical` and set `indexable: true`.
  {
    pt: '/blog/[slug]',
    en: '/en/blog/[slug]',
    indexable: false,
    canonical: 'pt',
  },
] as const satisfies readonly LocalizedPage[]

export const homePath: Readonly<Record<InterfaceLanguage, string>> = {
  pt: localizePath('/', 'pt'),
  en: localizePath('/', 'en'),
}

export const dynamicSegment = /\[[^\]]+\]/g

const routeMatchers = localizedPages.map((page) => ({
  page,
  patterns: [page.pt, page.en].map(
    (route) => new RegExp(`^${route.replace(dynamicSegment, '([^/]+)')}$`),
  ),
}))

function normalizePathname(pathname: string): string {
  return pathname.replace(/[?#].*$/, '').replace(/\/+$/, '') || '/'
}

function matchLocalizedPage(path: string) {
  for (const { page, patterns } of routeMatchers) {
    for (const pattern of patterns) {
      const match = pattern.exec(path)
      if (match) {
        return { page, params: match.slice(1) }
      }
    }
  }
}

function fillRoute(route: string, params: string[]): string {
  let index = 0

  return route.replace(dynamicSegment, () => params[index++] ?? '')
}

export function getAlternates(
  pathname: string,
): NonNullable<Metadata['alternates']> {
  const normalized = normalizePathname(pathname)
  const match = matchLocalizedPage(normalized)

  if (!match) {
    return { canonical: normalized }
  }

  const { page, params } = match

  if (!page.indexable) {
    return {
      canonical:
        'canonical' in page
          ? fillRoute(page[page.canonical], params)
          : normalized,
    }
  }

  return {
    canonical: normalized,
    languages: {
      [htmlLang.pt]: fillRoute(page.pt, params),
      [htmlLang.en]: fillRoute(page.en, params),
      'x-default': fillRoute(page[DEFAULT_INTERFACE_LANGUAGE], params),
    },
  }
}

/** False when the URL canonicalizes elsewhere, so the sitemap can omit it. */
export function isCanonicalUrl(pathname: string): boolean {
  const normalized = normalizePathname(pathname)

  return getAlternates(normalized).canonical === normalized
}

/** Equivalent page in `target`, or the `target` home when there is no pair. */
export function getLanguageSwitchHref(
  pathname: string,
  target: InterfaceLanguage,
): string {
  const match = matchLocalizedPage(normalizePathname(pathname))

  return match ? fillRoute(match.page[target], match.params) : homePath[target]
}
