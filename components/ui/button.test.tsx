import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { expect, test, vi } from 'vitest'
import { Button, ButtonLink } from './button'

vi.mock('next/link', () => ({
  default: function MockLink({
    children,
    href,
    className,
  }: {
    children: ReactNode
    href: string
    className?: string
  }) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  },
}))

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

test('button keeps the default rounded-md radius', () => {
  render(<Button>Radius</Button>)
  const button = screen.getByRole('button', { name: 'Radius' })
  expect(button.className).toContain('rounded-md')
  expect(button.className).not.toContain('rounded-full')
})

test('button link pill shape uses rounded-full', () => {
  render(
    <ButtonLink href="/trilha" shape="pill">
      See the Trilha
    </ButtonLink>,
  )
  const link = screen.getByRole('link', { name: 'See the Trilha' })
  expect(link.getAttribute('href')).toBe('/trilha')
  expect(link.className).toContain('rounded-full')
  expect(link.className).not.toContain('rounded-md')
})
