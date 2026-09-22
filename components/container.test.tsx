import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { Container } from './container'

test('renders children', () => {
  render(<Container>Hello</Container>)
  expect(screen.getByText('Hello')).toBeDefined()
})

test('page width applies max-w-container', () => {
  const { container } = render(<Container width="page">Page</Container>)
  expect(container.firstElementChild?.className).toContain('max-w-container')
})

test('article width applies max-w-content', () => {
  const { container } = render(<Container width="article">Article</Container>)
  expect(container.firstElementChild?.className).toContain('max-w-content')
})
