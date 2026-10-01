import type { InterfaceLanguage } from './types'

const EN_PREFIX = '/en'

/** PT paths that also exist under /en. Posts are PT-only for now. */
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
 * Path of the page equivalent to `pathname` in `language`. EN has no post
 * pages, so a post maps to the EN listing; other PT-only pages map to the home.
 */
export function equivalentPath(
  pathname: string,
  language: InterfaceLanguage,
): string {
  const ptPath = toPtPath(pathname)

  if (language === 'pt' || enEquivalentPaths.has(ptPath)) {
    return localizePath(ptPath, language)
  }

  return localizePath(ptPath.startsWith('/blog/') ? '/blog' : '/', language)
}
