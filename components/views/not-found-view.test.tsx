import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { NotFoundView } from './not-found-view'

afterEach(() => {
  cleanup()
})

test('renders the Portuguese 404 with a link to the PT home', () => {
  render(<NotFoundView language="pt" />)

  expect(
    screen.getByRole('heading', { level: 1, name: 'Página não encontrada.' }),
  ).toBeTruthy()
  expect(
    screen
      .getByRole('link', { name: 'Voltar para o início' })
      .getAttribute('href'),
  ).toBe('/')
})

test('renders the English 404 with a link to the EN home', () => {
  render(<NotFoundView language="en" />)

  expect(
    screen.getByRole('heading', { level: 1, name: 'Page not found.' }),
  ).toBeTruthy()
  expect(
    screen.getByRole('link', { name: 'Back to home' }).getAttribute('href'),
  ).toBe('/en')
})
