import type { Metadata } from 'next'
import { htmlLang, type InterfaceLanguage } from './types'

type LocalizedPage = Readonly<Record<InterfaceLanguage, string>> & {
  /** `false` keeps the pair for the language switch only, with no hreflang. */
  readonly indexable: boolean
}

/**
 * Equivalent pages in each interface language. Adding an entry here is the
 * only change needed for a new PT/EN pair.
 */
export const localizedPages = [
  { pt: '/', en: '/en', indexable: true },
  { pt: '/blog', en: '/en/blog', indexable: true },
  { pt: '/community', en: '/en/community', indexable: true },
  { pt: '/about', en: '/en/about', indexable: true },
  { pt: '/trilha', en: '/en/trilha', indexable: false },
] as const satisfies readonly LocalizedPage[]

export type LocalizedPath<L extends InterfaceLanguage = InterfaceLanguage> =
  (typeof localizedPages)[number][L]

const homePath: { readonly [L in InterfaceLanguage]: LocalizedPath<L> } = {
  pt: '/',
  en: '/en',
}

export type Alternates = NonNullable<Metadata['alternates']>

/** Drops the query string, the hash, and any trailing slash. */
export function normalizePathname(pathname: string): string {
  return pathname.replace(/[?#].*$/, '').replace(/\/+$/, '') || '/'
}

function findLocalizedPage(path: string) {
  return localizedPages.find((page) => page.pt === path || page.en === path)
}

/**
 * Canonical for any page, plus hreflang alternates only when the page has an
 * indexable equivalent in the other language. `x-default` is the PT version.
 */
export function getAlternates(pathname: string): Alternates {
  const canonical = normalizePathname(pathname)
  const page = findLocalizedPage(canonical)

  if (!page?.indexable) {
    return { canonical }
  }

  return {
    canonical,
    languages: {
      [htmlLang.pt]: page.pt,
      [htmlLang.en]: page.en,
      'x-default': page.pt,
    },
  }
}

/** Equivalent page in `target`, or its home when the page has no pair. */
export function getLanguageSwitchHref(
  pathname: string,
  target: InterfaceLanguage,
): LocalizedPath {
  const page = findLocalizedPage(normalizePathname(pathname))

  return page ? page[target] : homePath[target]
}
