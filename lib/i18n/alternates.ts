import type { Metadata } from 'next'
import {
  DEFAULT_INTERFACE_LANGUAGE,
  htmlLang,
  type InterfaceLanguage,
} from './types'

type LocalizedPage = Readonly<Record<InterfaceLanguage, string>> & {
  /** `false` keeps the pair for the language switch only, with no hreflang. */
  readonly indexable: boolean
}

export const localizedPages = [
  { pt: '/', en: '/en', indexable: true },
  { pt: '/blog', en: '/en/blog', indexable: true },
  { pt: '/community', en: '/en/community', indexable: true },
  { pt: '/about', en: '/en/about', indexable: true },
  { pt: '/trilha', en: '/en/trilha', indexable: false },
] as const satisfies readonly LocalizedPage[]

export type LocalizedPath<L extends InterfaceLanguage = InterfaceLanguage> =
  (typeof localizedPages)[number][L]

export const homePath: { readonly [L in InterfaceLanguage]: LocalizedPath<L> } =
  {
    pt: '/',
    en: '/en',
  }

function normalizePathname(pathname: string): string {
  return pathname.replace(/[?#].*$/, '').replace(/\/+$/, '') || '/'
}

function findLocalizedPage(path: string) {
  return localizedPages.find((page) => page.pt === path || page.en === path)
}

export function getAlternates(
  pathname: string,
): NonNullable<Metadata['alternates']> {
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
      'x-default': page[DEFAULT_INTERFACE_LANGUAGE],
    },
  }
}

/** Equivalent page in `target`, or the `target` home when there is no pair. */
export function getLanguageSwitchHref(
  pathname: string,
  target: InterfaceLanguage,
): LocalizedPath {
  const page = findLocalizedPage(normalizePathname(pathname))

  return page ? page[target] : homePath[target]
}
