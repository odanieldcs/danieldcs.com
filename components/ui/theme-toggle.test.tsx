import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, test } from 'vitest'
import { InterfaceLanguageProvider } from '@/components/interface-language-provider'
import { ThemeProvider } from '@/components/theme-provider'
import type { InterfaceLanguage } from '@/lib/i18n/types'
import { ThemeToggle } from './theme-toggle'

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
})

afterEach(() => {
  cleanup()
  localStorage.clear()
  document.documentElement.className = ''
  document.documentElement.lang = ''
})

function renderToggle(language: InterfaceLanguage = 'en') {
  return render(
    <ThemeProvider>
      <InterfaceLanguageProvider initialLanguage={language}>
        <ThemeToggle />
      </InterfaceLanguageProvider>
    </ThemeProvider>,
  )
}

test('names the destination theme and toggles light and dark', async () => {
  renderToggle()

  const toDark = await screen.findByRole('button', { name: 'Dark mode' })
  expect(toDark.className).toContain('min-w-11')
  expect(toDark.className).toContain('min-h-11')
  expect(toDark.textContent).not.toContain('Dark mode')
  expect(screen.getByRole('tooltip').textContent).toBe('Dark mode')
  expect(toDark.getAttribute('aria-describedby')).toBe(
    screen.getByRole('tooltip').id,
  )

  fireEvent.click(toDark)

  const toLight = await screen.findByRole('button', { name: 'Light mode' })
  expect(document.documentElement.classList.contains('dark')).toBe(true)
  expect(toLight.querySelector('svg')).toBeTruthy()

  fireEvent.click(toLight)

  await screen.findByRole('button', { name: 'Dark mode' })
  expect(document.documentElement.classList.contains('dark')).toBe(false)
})

test('uses the interface language for the theme label', async () => {
  renderToggle('pt')

  const toDark = await screen.findByRole('button', { name: 'Modo escuro' })
  expect(toDark.textContent).not.toContain('Modo escuro')
  expect(screen.getByRole('tooltip').textContent).toBe('Modo escuro')
})
