import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { writeInterfaceLanguageCookie } from '@/lib/i18n/cookie'
import { INTERFACE_LANGUAGE_COOKIE_NAME } from '@/lib/i18n/types'
import {
  InterfaceLanguageProvider,
  useInterfaceLanguage,
  useUiDictionary,
} from './interface-language-provider'

afterEach(() => {
  cleanup()
  // biome-ignore lint/suspicious/noDocumentCookie: test cleanup of the jsdom cookie jar
  document.cookie = `${INTERFACE_LANGUAGE_COOKIE_NAME}=; Path=/; Max-Age=0`
  document.documentElement.lang = ''
})

function LanguageProbe() {
  const { language, setLanguage } = useInterfaceLanguage()
  const dictionary = useUiDictionary()

  return (
    <div>
      <p data-testid="language">{language}</p>
      <p data-testid="blog-label">{dictionary.nav.blog}</p>
      <button type="button" onClick={() => setLanguage('en')}>
        Switch to English
      </button>
      <button type="button" onClick={() => setLanguage('pt')}>
        Switch to Portuguese
      </button>
    </div>
  )
}

function readLanguageCookie(): string | undefined {
  return document.cookie
    .split('; ')
    .find((part) => part.startsWith(`${INTERFACE_LANGUAGE_COOKIE_NAME}=`))
    ?.split('=')[1]
}

test('uses the initialLanguage prop as the default without reading storage', () => {
  writeInterfaceLanguageCookie('en')

  render(
    <InterfaceLanguageProvider initialLanguage="pt">
      <LanguageProbe />
    </InterfaceLanguageProvider>,
  )

  expect(screen.getByTestId('language').textContent).toBe('pt')
  expect(screen.getByTestId('blog-label').textContent).toBe('Blog')
})

test('setLanguage updates the hook, cookie, and document lang', () => {
  render(
    <InterfaceLanguageProvider initialLanguage="pt">
      <LanguageProbe />
    </InterfaceLanguageProvider>,
  )

  fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }))

  expect(screen.getByTestId('language').textContent).toBe('en')
  expect(screen.getByTestId('blog-label').textContent).toBe('Writing')
  expect(readLanguageCookie()).toBe('en')
  expect(document.documentElement.lang).toBe('en')
})

test('remount with initialLanguage="en" reflects persisted language', () => {
  const { unmount } = render(
    <InterfaceLanguageProvider initialLanguage="pt">
      <LanguageProbe />
    </InterfaceLanguageProvider>,
  )

  fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }))
  expect(readLanguageCookie()).toBe('en')
  unmount()

  render(
    <InterfaceLanguageProvider initialLanguage="en">
      <LanguageProbe />
    </InterfaceLanguageProvider>,
  )

  expect(screen.getByTestId('language').textContent).toBe('en')
  expect(screen.getByTestId('blog-label').textContent).toBe('Writing')
})
