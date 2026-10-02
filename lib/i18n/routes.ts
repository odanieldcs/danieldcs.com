import type { InterfaceLanguage } from './types'

const EN_PREFIX = '/en'

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
