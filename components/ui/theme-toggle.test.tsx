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
})

function renderToggle(language: InterfaceLanguage = 'en') {
  return render(
    <ThemeProvider>
      <InterfaceLanguageProvider language={language}>
        <ThemeToggle />
      </InterfaceLanguageProvider>
    </ThemeProvider>,
  )
}

test('names the destination theme and toggles light and dark', async () => {
  renderToggle()

  const toLight = await screen.findByRole('button', { name: 'Light mode' })
  expect(toLight.className).toContain('min-w-11')
  expect(toLight.className).toContain('min-h-11')
  expect(toLight.className).toContain('cursor-pointer')
  expect(toLight.textContent).not.toContain('Light mode')
  expect(screen.getByRole('tooltip').textContent).toBe('Light mode')
  expect(toLight.getAttribute('aria-describedby')).toBe(
    screen.getByRole('tooltip').id,
  )
  expect(document.documentElement.classList.contains('dark')).toBe(true)

  fireEvent.click(toLight)

  const toDark = await screen.findByRole('button', { name: 'Dark mode' })
  expect(document.documentElement.classList.contains('dark')).toBe(false)
  expect(toDark.querySelector('svg')).toBeTruthy()

  fireEvent.click(toDark)

  await screen.findByRole('button', { name: 'Light mode' })
  expect(document.documentElement.classList.contains('dark')).toBe(true)
})

test('uses the interface language for the theme label', async () => {
  renderToggle('pt')

  const toLight = await screen.findByRole('button', { name: 'Modo claro' })
  expect(toLight.textContent).not.toContain('Modo claro')
  expect(screen.getByRole('tooltip').textContent).toBe('Modo claro')
})
