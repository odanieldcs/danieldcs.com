import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { InterfaceLanguageProvider } from '@/components/interface-language-provider'
import { INTERFACE_LANGUAGE_COOKIE_NAME } from '@/lib/i18n/types'
import { LanguageSwitch } from './language-switch'

afterEach(() => {
  cleanup()
  // biome-ignore lint/suspicious/noDocumentCookie: test cleanup of the jsdom cookie jar
  document.cookie = `${INTERFACE_LANGUAGE_COOKIE_NAME}=; Path=/; Max-Age=0`
  document.documentElement.lang = ''
})

test('shows the destination language label and toggles pt and en', () => {
  render(
    <InterfaceLanguageProvider initialLanguage="pt">
      <LanguageSwitch />
    </InterfaceLanguageProvider>,
  )

  const toEnglish = screen.getByRole('button', { name: 'Switch to English' })
  expect(toEnglish.className).toContain('border')

  fireEvent.click(toEnglish)

  expect(
    screen.getByRole('button', { name: 'Mudar para português' }),
  ).toBeTruthy()
  expect(document.documentElement.lang).toBe('en')

  fireEvent.click(screen.getByRole('button', { name: 'Mudar para português' }))

  expect(
    screen.getByRole('button', { name: 'Switch to English' }),
  ).toBeTruthy()
  expect(document.documentElement.lang).toBe('pt')
})
