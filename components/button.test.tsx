import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { Button } from './button'

test('primary variant uses inverted foreground/background tokens', () => {
  render(<Button variant="primary">Save</Button>)
  const button = screen.getByRole('button', { name: 'Save' })
  expect(button.className).toContain('bg-foreground')
  expect(button.className).toContain('text-background')
  expect(button.className).toContain('px-4')
})

test('outline variant uses border token without fill', () => {
  render(<Button variant="outline">Cancel</Button>)
  const button = screen.getByRole('button', { name: 'Cancel' })
  expect(button.className).toContain('border-border')
  expect(button.className).toContain('bg-transparent')
  expect(button.className).toContain('text-foreground')
  expect(button.className).toContain('px-4')
})

test('ghost variant is transparent without a border', () => {
  render(<Button variant="ghost">Menu</Button>)
  const button = screen.getByRole('button', { name: 'Menu' })
  expect(button.className).toContain('bg-transparent')
  expect(button.className).toContain('text-foreground')
  expect(button.className).toContain('hover:bg-foreground/5')
  expect(button.className).not.toContain('border')
  expect(button.className).not.toContain('px-4')
})

test('meets touch target and keyboard focus styling', () => {
  render(<Button>Action</Button>)
  const button = screen.getByRole('button', { name: 'Action' })
  expect(button.className).toContain('min-h-11')
  expect(button.className).toContain('focus-visible:ring-2')
})

test('forwards disabled state', () => {
  render(<Button disabled>Disabled</Button>)
  const button = screen.getByRole('button', { name: 'Disabled' })
  expect(button.hasAttribute('disabled')).toBe(true)
})
