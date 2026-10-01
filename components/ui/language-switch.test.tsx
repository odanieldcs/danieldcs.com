import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, expect, test, vi } from 'vitest'
import { InterfaceLanguageProvider } from '@/components/interface-language-provider'
import { LanguageSwitch } from './language-switch'

const navigation = vi.hoisted(() => ({
  pathname: '/',
}))

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
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

afterEach(() => {
  cleanup()
  navigation.pathname = '/'
})

function renderSwitch(language: 'pt' | 'en' = 'pt', pathname = '/') {
  navigation.pathname = pathname
  return render(
    <InterfaceLanguageProvider language={language}>
      <LanguageSwitch />
    </InterfaceLanguageProvider>,
  )
}

test('links to the English home when the language is pt', () => {
  renderSwitch()

  const toEnglish = screen.getByRole('link', { name: 'Switch to English' })
  expect(toEnglish.getAttribute('href')).toBe('/en')
  expect(toEnglish.className).toContain('min-w-11')
  expect(toEnglish.className).toContain('min-h-11')
  expect(toEnglish.textContent).not.toContain('Switch to English')
  expect(toEnglish.querySelector('svg')?.getAttribute('aria-hidden')).toBe(
    'true',
  )
  expect(screen.getByRole('tooltip').textContent).toBe('Switch to English')
  expect(screen.getByRole('tooltip').className).toContain('right-0')
  expect(toEnglish.getAttribute('aria-describedby')).toBe(
    screen.getByRole('tooltip').id,
  )
})

test('links to the Portuguese home when the language is en', () => {
  renderSwitch('en', '/en')

  const toPortuguese = screen.getByRole('link', {
    name: 'Mudar para português',
  })
  expect(toPortuguese.getAttribute('href')).toBe('/')
  expect(screen.getByRole('tooltip').textContent).toBe('Mudar para português')
})

test('links to the equivalent page in the other language', () => {
  renderSwitch('pt', '/about')
  expect(
    screen.getByRole('link', { name: 'Switch to English' }).getAttribute('href'),
  ).toBe('/en/about')
  cleanup()

  renderSwitch('en', '/en/blog')
  expect(
    screen
      .getByRole('link', { name: 'Mudar para português' })
      .getAttribute('href'),
  ).toBe('/blog')
})

test('links a post to the English listing, since posts are PT-only', () => {
  renderSwitch('pt', '/blog/hello-world')

  expect(
    screen.getByRole('link', { name: 'Switch to English' }).getAttribute('href'),
  ).toBe('/en/blog')
})
