import {
  DEFAULT_INTERFACE_LANGUAGE,
  INTERFACE_LANGUAGE_COOKIE_NAME,
  type InterfaceLanguage,
  isInterfaceLanguage,
} from './types'

export const INTERFACE_LANGUAGE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365

type CookieStoreLike = {
  get(name: string): { value: string } | undefined
}

export function parseInterfaceLanguageCookie(
  value: string | undefined,
): InterfaceLanguage {
  const normalized = value?.trim()
  return isInterfaceLanguage(normalized)
    ? normalized
    : DEFAULT_INTERFACE_LANGUAGE
}

export function getInterfaceLanguageFromCookieStore(
  store: CookieStoreLike,
): InterfaceLanguage {
  return parseInterfaceLanguageCookie(
    store.get(INTERFACE_LANGUAGE_COOKIE_NAME)?.value,
  )
}

export function serializeInterfaceLanguageCookie(
  lang: InterfaceLanguage,
): string {
  return [
    `${INTERFACE_LANGUAGE_COOKIE_NAME}=${lang}`,
    'Path=/',
    `Max-Age=${INTERFACE_LANGUAGE_COOKIE_MAX_AGE_SECONDS}`,
    'SameSite=Lax',
  ].join('; ')
}

export function writeInterfaceLanguageCookie(lang: InterfaceLanguage): void {
  if (typeof document === 'undefined') {
    return
  }

  // biome-ignore lint/suspicious/noDocumentCookie: non-HttpOnly cookie must be writable from the client
  document.cookie = serializeInterfaceLanguageCookie(lang)
}
