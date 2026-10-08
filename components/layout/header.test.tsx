import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, expect, test, vi } from 'vitest'
import { InterfaceLanguageProvider } from '@/components/interface-language-provider'
import { Header } from './header'

const navigation = vi.hoisted(() => ({
  pathname: '/',
}))

vi.mock('next/image', () => ({
  default: function MockImage({ alt, src }: { alt: string; src: string }) {
    return <img alt={alt} src={src} />
  },
}))

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

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('@/components/ui/theme-toggle', () => ({
  ThemeToggle: () => <button type="button">Theme</button>,
}))

afterEach(() => {
  cleanup()
  navigation.pathname = '/'
})

function renderHeader(language: 'pt' | 'en' = 'pt') {
  return render(
    <InterfaceLanguageProvider language={language}>
      <Header language={language} />
    </InterfaceLanguageProvider>,
  )
}

test('identity links home and desktop nav lists the public items', () => {
  renderHeader()

  const home = screen.getByRole('link', { name: 'Daniel Castro' })
  expect(home.getAttribute('href')).toBe('/')
  expect(home.querySelector('img')?.getAttribute('src')).toBe(
    '/media/icons/logo-ddev.png',
  )
  expect(home.querySelector('img')?.getAttribute('alt')).toBe('')
  expect(screen.queryByRole('link', { name: 'danieldcs.com' })).toBeNull()
  expect(screen.queryByText('DC')).toBeNull()
  expect(screen.queryByRole('heading', { name: 'Daniel Castro' })).toBeNull()

  const shell = document.querySelector('header > div')
  expect(shell?.className).toContain('grid-cols-[1fr_auto_1fr]')
  expect(shell?.className).toContain('py-8')

  const blog = screen.getByRole('link', { name: 'Blog' })
  const comunidade = screen.getByRole('link', { name: 'Comunidade' })
  const sobre = screen.getByRole('link', { name: 'Sobre' })
  expect(blog.getAttribute('href')).toBe('/blog')
  expect(comunidade.getAttribute('href')).toBe('/community')
  expect(sobre.getAttribute('href')).toBe('/about')
  for (const link of [blog, comunidade, sobre]) {
    expect(link.className).toContain('px-4')
    expect(link.className).toContain('py-2.5')
  }

  const nav = screen.getByRole('navigation', { name: 'Navegação principal' })
  expect(nav.className).toContain('hidden')
  expect(nav.className).toContain('md:flex')
  expect(nav.className).toContain('gap-1')
  const highlight = nav.querySelector('[data-header-highlight]')
  expect(highlight?.className).toContain('bg-foreground/')
  expect(highlight?.className).toContain('duration-300')
  expect((highlight as HTMLElement | null)?.style.opacity).toBe('0')
  const mobileSlot = document.querySelector('header .md\\:hidden')
  const menuButton = screen.getByRole('button', { name: 'Menu' })
  const themeButton = screen.getByRole('button', { name: 'Theme' })
  expect(mobileSlot?.contains(menuButton)).toBe(true)
  expect(mobileSlot?.contains(themeButton)).toBe(false)
  expect(screen.getByRole('button', { name: 'Theme' })).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Switch to English' })).toBeTruthy()

  const controls = document.querySelector('[data-header-controls]')
  const controlsHighlight = controls?.querySelector('[data-header-highlight]')
  expect(
    controls?.contains(screen.getByRole('button', { name: 'Theme' })),
  ).toBe(true)
  expect(
    controls?.contains(screen.getByRole('link', { name: 'Switch to English' })),
  ).toBe(true)
  expect(controlsHighlight?.className).toContain('bg-foreground/')
  expect(controlsHighlight?.className).toContain('duration-300')
  expect((controlsHighlight as HTMLElement | null)?.style.opacity).toBe('0')
})

test('marks the current route and nested paths as active', () => {
  navigation.pathname = '/blog'
  const { unmount } = renderHeader()

  expect(
    screen.getByRole('link', { name: 'Blog' }).className.split(/\s+/),
  ).toContain('text-foreground')
  expect(screen.getByRole('link', { name: 'Comunidade' }).className).toContain(
    'text-foreground/80',
  )
  expect(
    screen
      .getByRole('navigation', { name: 'Navegação principal' })
      .querySelector('[data-header-highlight]')
      ?.getAttribute('style'),
  ).toContain('opacity: 1')
  unmount()

  navigation.pathname = '/blog/content-system'
  renderHeader()

  expect(
    screen.getByRole('link', { name: 'Blog' }).className.split(/\s+/),
  ).toContain('text-foreground')
  expect(screen.getByRole('link', { name: 'Sobre' }).className).toContain(
    'text-foreground/80',
  )
})

test('uses English nav labels and /en links when the interface language is en', () => {
  navigation.pathname = '/en/about'
  renderHeader('en')

  expect(
    screen.getByRole('link', { name: 'Daniel Castro' }).getAttribute('href'),
  ).toBe('/en')
  expect(
    screen.getByRole('link', { name: 'Writing' }).getAttribute('href'),
  ).toBe('/en/blog')
  expect(
    screen.getByRole('link', { name: 'Community' }).getAttribute('href'),
  ).toBe('/en/community')
  expect(screen.getByRole('link', { name: 'About' }).getAttribute('href')).toBe(
    '/en/about',
  )
  expect(
    screen.getByRole('link', { name: 'About' }).className.split(/\s+/),
  ).toContain('text-foreground')
  expect(screen.queryByRole('link', { name: 'Blog' })).toBeNull()
  expect(
    screen.getByRole('navigation', { name: 'Main navigation' }),
  ).toBeTruthy()
})
