import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, expect, test, vi } from 'vitest'
import { NavLink, navLinkClassName } from './nav-link'

vi.mock('next/link', () => ({
  default: function MockLink({
    children,
    href,
    className,
    ...rest
  }: {
    children: ReactNode
    href: string
    className?: string
  }) {
    return (
      <a href={href} className={className} {...rest}>
        {children}
      </a>
    )
  },
}))

afterEach(() => {
  cleanup()
})

test('renders a navigation link with link tokens', () => {
  render(<NavLink href="/example">Section</NavLink>)
  const link = screen.getByRole('link', { name: 'Section' })
  expect(link.className).toContain('text-link')
  expect(link.className).toContain('text-body')
  expect(link.className).not.toContain('underline')
})

test('active state uses foreground emphasis', () => {
  expect(navLinkClassName({ active: true })).toContain('text-foreground')
  expect(navLinkClassName({ active: true })).toContain('font-medium')

  render(
    <NavLink href="/example" active>
      Current
    </NavLink>,
  )
  const link = screen.getByRole('link', { name: 'Current' })
  expect(link.className).toContain('text-foreground')
  expect(link.className).toContain('font-medium')
})
