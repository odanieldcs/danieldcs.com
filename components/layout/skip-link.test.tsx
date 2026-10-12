import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { SkipLink } from './skip-link'

afterEach(() => {
  cleanup()
})

test('points at #conteudo in Portuguese and English', () => {
  const { unmount } = render(<SkipLink label="Pular para o conteúdo" />)

  const link = screen.getByRole('link', { name: 'Pular para o conteúdo' })
  expect(link.getAttribute('href')).toBe('#conteudo')
  expect(link.closest('nav')).toBeNull()

  unmount()
  render(<SkipLink label="Skip to content" />)

  expect(
    screen.getByRole('link', { name: 'Skip to content' }).getAttribute('href'),
  ).toBe('#conteudo')
})
