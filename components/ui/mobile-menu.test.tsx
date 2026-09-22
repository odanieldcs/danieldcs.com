import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, expect, test, vi } from 'vitest'
import { MobileMenu, type MobileMenuItem } from './mobile-menu'

const items: readonly MobileMenuItem[] = [
  { href: '/blog', label: 'Blog' },
  { href: '/community', label: 'Comunidade' },
  { href: '/trilha', label: 'Trilha' },
  { href: '/about', label: 'Sobre' },
]

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

function renderMenu() {
  return render(
    <MobileMenu
      items={items}
      triggerLabel="Menu"
      navAriaLabel="Navegação principal"
    />,
  )
}

test('toggle button reflects open state with aria-expanded', () => {
  renderMenu()
  const trigger = screen.getByRole('button', { name: 'Menu' })

  expect(trigger.getAttribute('aria-expanded')).toBe('false')
  expect(trigger.getAttribute('aria-controls')).toBeTruthy()

  fireEvent.click(trigger)
  expect(trigger.getAttribute('aria-expanded')).toBe('true')
  expect(
    screen.getByRole('navigation', { name: 'Navegação principal' }),
  ).toBeTruthy()

  fireEvent.click(trigger)
  expect(trigger.getAttribute('aria-expanded')).toBe('false')
})

test('Escape closes an open menu', () => {
  renderMenu()
  const trigger = screen.getByRole('button', { name: 'Menu' })

  fireEvent.click(trigger)
  expect(trigger.getAttribute('aria-expanded')).toBe('true')

  fireEvent.keyDown(document, { key: 'Escape' })
  expect(trigger.getAttribute('aria-expanded')).toBe('false')
})

test('opens the four real navigation links and no placeholders', () => {
  renderMenu()
  fireEvent.click(screen.getByRole('button', { name: 'Menu' }))

  expect(screen.getByRole('link', { name: 'Blog' }).getAttribute('href')).toBe(
    '/blog',
  )
  expect(
    screen.getByRole('link', { name: 'Comunidade' }).getAttribute('href'),
  ).toBe('/community')
  expect(
    screen.getByRole('link', { name: 'Trilha' }).getAttribute('href'),
  ).toBe('/trilha')
  expect(screen.getByRole('link', { name: 'Sobre' }).getAttribute('href')).toBe(
    '/about',
  )
  expect(screen.queryByText(/Placeholder/)).toBeNull()
})
