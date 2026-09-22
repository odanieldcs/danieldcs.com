import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { MobileMenu } from './mobile-menu'

afterEach(() => {
  cleanup()
})

test('toggle button reflects open state with aria-expanded', () => {
  render(<MobileMenu />)
  const trigger = screen.getByRole('button', { name: 'Menu' })

  expect(trigger.getAttribute('aria-expanded')).toBe('false')
  expect(trigger.getAttribute('aria-controls')).toBeTruthy()

  fireEvent.click(trigger)
  expect(trigger.getAttribute('aria-expanded')).toBe('true')
  expect(screen.getByRole('navigation', { name: 'Example mobile navigation' })).toBeTruthy()

  fireEvent.click(trigger)
  expect(trigger.getAttribute('aria-expanded')).toBe('false')
})

test('Escape closes an open menu', () => {
  render(<MobileMenu />)
  const trigger = screen.getByRole('button', { name: 'Menu' })

  fireEvent.click(trigger)
  expect(trigger.getAttribute('aria-expanded')).toBe('true')

  fireEvent.keyDown(document, { key: 'Escape' })
  expect(trigger.getAttribute('aria-expanded')).toBe('false')
})
