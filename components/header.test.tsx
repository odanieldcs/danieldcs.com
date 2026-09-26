import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, expect, test, vi } from 'vitest'
import { InterfaceLanguageProvider } from '@/components/interface-language-provider'
import { INTERFACE_LANGUAGE_COOKIE_NAME } from '@/lib/i18n/types'
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
}))

vi.mock('@/components/ui/theme-toggle', () => ({
  ThemeToggle: () => <button type="button">Theme</button>,
}))

afterEach(() => {
  cleanup()
  navigation.pathname = '/'
  // biome-ignore lint/suspicious/noDocumentCookie: test cleanup of the jsdom cookie jar
  document.cookie = `${INTERFACE_LANGUAGE_COOKIE_NAME}=; Path=/; Max-Age=0`
  document.documentElement.lang = ''
})

function renderHeader(language: 'pt' | 'en' = 'pt') {
  return render(
    <InterfaceLanguageProvider initialLanguage={language}>
      <Header />
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

  expect(screen.getByRole('link', { name: 'Blog' }).getAttribute('href')).toBe(
    '/blog',
  )
  expect(
    screen.getByRole('link', { name: 'Comunidade' }).getAttribute('href'),
  ).toBe('/community')
  expect(screen.getByRole('link', { name: 'Sobre' }).getAttribute('href')).toBe(
    '/about',
  )

  const nav = screen.getByRole('navigation', { name: 'Navegação principal' })
  expect(nav.className).toContain('hidden')
  expect(nav.className).toContain('md:flex')
  const mobileSlot = document.querySelector('header .md\\:hidden')
  const menuButton = screen.getByRole('button', { name: 'Menu' })
  const themeButton = screen.getByRole('button', { name: 'Theme' })
  expect(mobileSlot?.contains(menuButton)).toBe(true)
  expect(mobileSlot?.contains(themeButton)).toBe(false)
  expect(screen.getByRole('button', { name: 'Theme' })).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Switch to English' })).toBeTruthy()
})

test('marks the current route and nested paths as active', () => {
  navigation.pathname = '/blog'
  const { unmount } = renderHeader()

  expect(
    screen.getByRole('link', { name: 'Blog' }).className.split(/\s+/),
  ).toContain('text-foreground')
  expect(screen.getByRole('link', { name: 'Comunidade' }).className).toContain(
    'text-foreground/70',
  )
  unmount()

  navigation.pathname = '/blog/content-system'
  renderHeader()

  expect(
    screen.getByRole('link', { name: 'Blog' }).className.split(/\s+/),
  ).toContain('text-foreground')
  expect(screen.getByRole('link', { name: 'Sobre' }).className).toContain(
    'text-foreground/70',
  )
})

test('uses English nav labels when the interface language is en', () => {
  navigation.pathname = '/about'
  renderHeader('en')

  expect(screen.getByRole('link', { name: 'Writing' })).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Community' })).toBeTruthy()
  expect(
    screen.getByRole('link', { name: 'About' }).className.split(/\s+/),
  ).toContain('text-foreground')
  expect(screen.queryByRole('link', { name: 'Blog' })).toBeNull()
  expect(
    screen.getByRole('navigation', { name: 'Main navigation' }),
  ).toBeTruthy()
})
