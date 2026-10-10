import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { MobileMenu, type MobileMenuItem } from './mobile-menu'

const items: readonly MobileMenuItem[] = [
  { href: '/blog', label: 'Blog', ctaTarget: 'blog' },
  { href: '/community', label: 'Comunidade', ctaTarget: 'community' },
  { href: '/about', label: 'Sobre', ctaTarget: 'about' },
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

type MediaChangeListener = (event: { matches: boolean }) => void

const mediaListeners = new Set<MediaChangeListener>()
let mediaMatches = false

function installMatchMedia() {
  vi.stubGlobal('matchMedia', ((query: string) => ({
    get matches() {
      return mediaMatches
    },
    media: query,
    addEventListener(_type: string, listener: MediaChangeListener) {
      mediaListeners.add(listener)
    },
    removeEventListener(_type: string, listener: MediaChangeListener) {
      mediaListeners.delete(listener)
    },
  })) as typeof window.matchMedia)
}

function emitMediaChange(matches: boolean) {
  mediaMatches = matches
  for (const listener of [...mediaListeners]) {
    listener({ matches })
  }
}

beforeEach(() => {
  mediaMatches = false
  mediaListeners.clear()
  installMatchMedia()
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  document.body.replaceChildren()
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
})

function renderMenu() {
  const header = document.createElement('header')
  const main = document.createElement('main')
  const footer = document.createElement('footer')
  const alreadyInert = document.createElement('div')
  alreadyInert.inert = true
  document.body.append(header, main, footer, alreadyInert)

  const view = render(
    <MobileMenu
      items={items}
      triggerLabel="Menu"
      navAriaLabel="Navegação principal"
    />,
    { container: header },
  )

  return { ...view, header, main, footer, alreadyInert }
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

test('Escape closes an open menu, restores scroll, and returns focus', () => {
  renderMenu()
  const trigger = screen.getByRole('button', { name: 'Menu' })

  fireEvent.click(trigger)
  expect(trigger.getAttribute('aria-expanded')).toBe('true')
  expect(document.body.style.overflow).toBe('hidden')
  expect(document.documentElement.style.overflow).toBe('hidden')

  fireEvent.keyDown(document, { key: 'Escape' })
  expect(trigger.getAttribute('aria-expanded')).toBe('false')
  expect(document.activeElement).toBe(trigger)
  expect(document.body.style.overflow).toBe('')
  expect(document.documentElement.style.overflow).toBe('')
})

test('opens a full-screen overlay and closes when a link is chosen', () => {
  renderMenu()
  const trigger = screen.getByRole('button', { name: 'Menu' })

  expect(trigger.querySelector('svg')).toBeTruthy()
  expect(trigger.textContent).toBe('')

  fireEvent.click(trigger)

  const nav = screen.getByRole('navigation', { name: 'Navegação principal' })
  expect(nav.className).toContain('fixed')
  expect(nav.className).toContain('inset-0')
  expect(document.body.contains(nav)).toBe(true)
  expect(document.body.style.overflow).toBe('hidden')
  expect(document.documentElement.style.overflow).toBe('hidden')

  fireEvent.click(screen.getByRole('link', { name: 'Blog' }))
  expect(trigger.getAttribute('aria-expanded')).toBe('false')
  expect(
    screen.queryByRole('navigation', { name: 'Navegação principal' }),
  ).toBeNull()
  expect(document.body.style.overflow).toBe('')
  expect(document.documentElement.style.overflow).toBe('')
})

test('opens the public navigation links and no placeholders', () => {
  renderMenu()
  fireEvent.click(screen.getByRole('button', { name: 'Menu' }))

  expect(screen.getByRole('link', { name: 'Blog' }).getAttribute('href')).toBe(
    '/blog',
  )
  expect(
    screen.getByRole('link', { name: 'Comunidade' }).getAttribute('href'),
  ).toBe('/community')
  expect(screen.getByRole('link', { name: 'Sobre' }).getAttribute('href')).toBe(
    '/about',
  )
  expect(screen.queryByText(/Placeholder/)).toBeNull()
})

test('moves focus to the Blog link when opened', () => {
  renderMenu()
  fireEvent.click(screen.getByRole('button', { name: 'Menu' }))

  expect(document.activeElement).toBe(
    screen.getByRole('link', { name: 'Blog' }),
  )
})

test('makes siblings inert while open and restores only the nodes it changed', () => {
  const { header, main, footer, alreadyInert } = renderMenu()
  fireEvent.click(screen.getByRole('button', { name: 'Menu' }))

  const nav = screen.getByRole('navigation', { name: 'Navegação principal' })
  expect(main.inert).toBe(true)
  expect(footer.inert).toBe(true)
  expect(header.hasAttribute('inert')).toBe(false)
  expect(nav.hasAttribute('inert')).toBe(false)
  expect(alreadyInert.inert).toBe(true)

  fireEvent.click(screen.getByRole('button', { name: 'Menu' }))
  expect(main.inert).toBe(false)
  expect(footer.inert).toBe(false)
  expect(header.hasAttribute('inert')).toBe(false)
  expect(alreadyInert.inert).toBe(true)
  expect(
    screen.queryByRole('navigation', { name: 'Navegação principal' }),
  ).toBeNull()
})

test('closes and clears inert when the viewport reaches md', () => {
  const { main, footer } = renderMenu()
  fireEvent.click(screen.getByRole('button', { name: 'Menu' }))
  expect(main.inert).toBe(true)

  act(() => {
    emitMediaChange(true)
  })

  expect(
    screen.getByRole('button', { name: 'Menu' }).getAttribute('aria-expanded'),
  ).toBe('false')
  expect(
    screen.queryByRole('navigation', { name: 'Navegação principal' }),
  ).toBeNull()
  expect(main.inert).toBe(false)
  expect(footer.inert).toBe(false)
})

test('closes immediately when opened while the viewport is already md', () => {
  mediaMatches = true
  const { main, footer } = renderMenu()

  fireEvent.click(screen.getByRole('button', { name: 'Menu' }))

  expect(
    screen.getByRole('button', { name: 'Menu' }).getAttribute('aria-expanded'),
  ).toBe('false')
  expect(
    screen.queryByRole('navigation', { name: 'Navegação principal' }),
  ).toBeNull()
  expect(main.inert).toBe(false)
  expect(footer.inert).toBe(false)
})
