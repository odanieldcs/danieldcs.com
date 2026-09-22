import { afterEach, expect, test } from 'vitest'
import {
  getInterfaceLanguageFromCookieStore,
  INTERFACE_LANGUAGE_COOKIE_MAX_AGE_SECONDS,
  parseInterfaceLanguageCookie,
  serializeInterfaceLanguageCookie,
  writeInterfaceLanguageCookie,
} from './cookie'
import { INTERFACE_LANGUAGE_COOKIE_NAME } from './types'

function readCookieValue(): string | undefined {
  return document.cookie
    .split('; ')
    .find((part) => part.startsWith(`${INTERFACE_LANGUAGE_COOKIE_NAME}=`))
    ?.split('=')[1]
}

afterEach(() => {
  // biome-ignore lint/suspicious/noDocumentCookie: test cleanup of the jsdom cookie jar
  document.cookie = `${INTERFACE_LANGUAGE_COOKIE_NAME}=; Path=/; Max-Age=0`
})

test('parses supported language values', () => {
  expect(parseInterfaceLanguageCookie('pt')).toBe('pt')
  expect(parseInterfaceLanguageCookie('en')).toBe('en')
})

test('falls back to pt when the cookie is missing or invalid', () => {
  expect(parseInterfaceLanguageCookie(undefined)).toBe('pt')
  expect(parseInterfaceLanguageCookie('')).toBe('pt')
  expect(parseInterfaceLanguageCookie('  ')).toBe('pt')
  expect(parseInterfaceLanguageCookie('es')).toBe('pt')
  expect(parseInterfaceLanguageCookie('PT')).toBe('pt')
  expect(parseInterfaceLanguageCookie('en-US')).toBe('pt')
})

test('trims surrounding whitespace on a valid value', () => {
  expect(parseInterfaceLanguageCookie(' en ')).toBe('en')
})

test('reads the interface-language cookie from a cookie store', () => {
  expect(
    getInterfaceLanguageFromCookieStore({
      get: () => ({ value: 'en' }),
    }),
  ).toBe('en')
  expect(
    getInterfaceLanguageFromCookieStore({
      get: () => undefined,
    }),
  ).toBe('pt')
  expect(
    getInterfaceLanguageFromCookieStore({
      get: (name) =>
        name === INTERFACE_LANGUAGE_COOKIE_NAME ? { value: 'fr' } : undefined,
    }),
  ).toBe('pt')
})

test('serializes a document.cookie string with Path, Max-Age, and SameSite', () => {
  expect(serializeInterfaceLanguageCookie('en')).toBe(
    `${INTERFACE_LANGUAGE_COOKIE_NAME}=en; Path=/; Max-Age=${INTERFACE_LANGUAGE_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`,
  )
  expect(serializeInterfaceLanguageCookie('pt')).toBe(
    `${INTERFACE_LANGUAGE_COOKIE_NAME}=pt; Path=/; Max-Age=${INTERFACE_LANGUAGE_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`,
  )
})

test('write/read roundtrip persists the language in document.cookie', () => {
  writeInterfaceLanguageCookie('en')
  expect(parseInterfaceLanguageCookie(readCookieValue())).toBe('en')

  writeInterfaceLanguageCookie('pt')
  expect(parseInterfaceLanguageCookie(readCookieValue())).toBe('pt')
})
