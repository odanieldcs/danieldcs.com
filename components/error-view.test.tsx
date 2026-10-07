import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { ErrorView } from './error-view'

afterEach(() => {
  cleanup()
})

test('renders Portuguese copy with retry and home link to PT root', () => {
  const reset = vi.fn()

  render(<ErrorView language="pt" reset={reset} />)

  expect(
    screen.getByRole('heading', { level: 1, name: 'Algo deu errado.' }),
  ).toBeTruthy()
  expect(
    screen.getByRole('link', { name: 'Voltar para o início' }).getAttribute('href'),
  ).toBe('/')

  fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))
  expect(reset).toHaveBeenCalledOnce()
})

test('renders English copy with retry and home link to EN root', () => {
  const reset = vi.fn()

  render(<ErrorView language="en" reset={reset} />)

  expect(
    screen.getByRole('heading', { level: 1, name: 'Something went wrong.' }),
  ).toBeTruthy()
  expect(
    screen.getByRole('link', { name: 'Back to home' }).getAttribute('href'),
  ).toBe('/en')

  fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
  expect(reset).toHaveBeenCalledOnce()
})
