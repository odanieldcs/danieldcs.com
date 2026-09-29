import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import {
  InterfaceLanguageProvider,
  useInterfaceLanguage,
  useUiDictionary,
} from './interface-language-provider'

afterEach(() => {
  cleanup()
})

function LanguageProbe() {
  const { language } = useInterfaceLanguage()
  const dictionary = useUiDictionary()

  return (
    <div>
      <p data-testid="language">{language}</p>
      <p data-testid="blog-label">{dictionary.nav.blog}</p>
    </div>
  )
}

test('exposes the language prop and the Portuguese dictionary', () => {
  render(
    <InterfaceLanguageProvider language="pt">
      <LanguageProbe />
    </InterfaceLanguageProvider>,
  )

  expect(screen.getByTestId('language').textContent).toBe('pt')
  expect(screen.getByTestId('blog-label').textContent).toBe('Blog')
})

test('exposes the English dictionary when language is en', () => {
  render(
    <InterfaceLanguageProvider language="en">
      <LanguageProbe />
    </InterfaceLanguageProvider>,
  )

  expect(screen.getByTestId('language').textContent).toBe('en')
  expect(screen.getByTestId('blog-label').textContent).toBe('Writing')
})

test('useInterfaceLanguage throws outside the provider', () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

  expect(() => render(<LanguageProbe />)).toThrow(
    'useInterfaceLanguage must be used within InterfaceLanguageProvider',
  )

  consoleError.mockRestore()
})
