import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, expect, test } from 'vitest'
import { InterfaceLanguageProvider } from '@/components/interface-language-provider'
import { SkipLink } from './skip-link'

afterEach(() => {
  cleanup()
})

function renderSkipLink(language: 'pt' | 'en', children?: ReactNode) {
  return render(
    <InterfaceLanguageProvider language={language}>
      <SkipLink />
      {children}
    </InterfaceLanguageProvider>,
  )
}

test('renders Portuguese and English skip copy', () => {
  const { unmount } = renderSkipLink('pt')

  const link = screen.getByRole('link', { name: 'Pular para o conteúdo' })
  expect(link.getAttribute('href')).toBe('#conteudo')
  expect(
    screen.getByRole('navigation', { name: 'Atalho' }).contains(link),
  ).toBe(true)

  unmount()
  renderSkipLink('en')

  expect(screen.getByRole('link', { name: 'Skip to content' })).toBeTruthy()
  expect(screen.getByRole('navigation', { name: 'Skip' })).toBeTruthy()
})

test('click focuses the only main and sets tabIndex to -1', () => {
  renderSkipLink(
    'pt',
    <main>
      <h1>Conteúdo</h1>
    </main>,
  )

  fireEvent.click(screen.getByRole('link', { name: 'Pular para o conteúdo' }))

  const main = screen.getByRole('main')
  expect(document.activeElement).toBe(main)
  expect(main.tabIndex).toBe(-1)
})
