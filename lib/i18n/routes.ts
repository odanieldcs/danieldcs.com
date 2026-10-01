import type { InterfaceLanguage } from './types'

const EN_PREFIX = '/en'

/** PT paths that also exist under /en, besides each post at /blog/[slug]. */
const enEquivalentPaths = new Set([
  '/',
  '/blog',
  '/community',
  '/about',
  '/trilha',
])

/** Maps a PT (unprefixed) internal path to the same path in `language`. */
export function localizePath(
  href: `/${string}`,
  language: InterfaceLanguage,
): string {
  if (language === 'pt') {
    return href
  }

  return href === '/' ? EN_PREFIX : `${EN_PREFIX}${href}`
}

function toPtPath(pathname: string): `/${string}` {
  if (pathname === EN_PREFIX || pathname.startsWith(`${EN_PREFIX}/`)) {
    return `/${pathname.slice(EN_PREFIX.length + 1)}`
  }

  return `/${pathname.replace(/^\//, '')}`
}

/**
 * Path of the page equivalent to `pathname` in `language`. PT-only pages such
 * as /design-system map to the EN home.
 */
export function equivalentPath(
  pathname: string,
  language: InterfaceLanguage,
): string {
  const ptPath = toPtPath(pathname)
  const hasEnEquivalent =
    enEquivalentPaths.has(ptPath) || ptPath.startsWith('/blog/')

  return localizePath(
    language === 'pt' || hasEnEquivalent ? ptPath : '/',
    language,
  )
}
