import type { Metadata } from 'next'
import { localizePath } from './routes'
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
  // `[slug]` matches one segment and carries over to the other language.
  // Posts are PT-only for now; flip to indexable once they are translated.
  { pt: '/blog/[slug]', en: '/en/blog/[slug]', indexable: false },
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
  const canonical = normalizePathname(pathname)
  const match = matchLocalizedPage(canonical)

  if (!match?.page.indexable) {
    return { canonical }
  }

  const { page, params } = match

  return {
    canonical,
    languages: {
      [htmlLang.pt]: fillRoute(page.pt, params),
      [htmlLang.en]: fillRoute(page.en, params),
      'x-default': fillRoute(page[DEFAULT_INTERFACE_LANGUAGE], params),
    },
  }
}

/** Equivalent page in `target`, or the `target` home when there is no pair. */
export function getLanguageSwitchHref(
  pathname: string,
  target: InterfaceLanguage,
): string {
  const match = matchLocalizedPage(normalizePathname(pathname))

  return match ? fillRoute(match.page[target], match.params) : homePath[target]
}
