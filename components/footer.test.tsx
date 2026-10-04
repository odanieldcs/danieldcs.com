import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { InterfaceLanguageProvider } from '@/components/interface-language-provider'
import { linkedInProfileUrl, siteName } from '@/lib/site'
import { Footer } from './footer'

afterEach(() => {
  cleanup()
})

function renderFooter(language: 'pt' | 'en' = 'pt') {
  return render(
    <InterfaceLanguageProvider language={language}>
      <Footer />
    </InterfaceLanguageProvider>,
  )
}

const socialLinks = [
  ['LinkedIn', linkedInProfileUrl],
  ['GitHub', 'https://github.com/odanieldcs'],
  ['YouTube', 'https://www.youtube.com/@odanieldcs'],
  ['Instagram', 'https://www.instagram.com/odanieldcs'],
] as const

test('renders social links, tagline, privacy link, and the current year', () => {
  renderFooter()

  expect(screen.queryByRole('link', { name: 'hi@danieldcs.com' })).toBeNull()
  expect(screen.queryByText(/mailto:/)).toBeNull()

  for (const [name, href] of socialLinks) {
    const link = screen.getByRole('link', { name })
    expect(link.getAttribute('href')).toBe(href)
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    expect(link.className).toContain('text-muted')
    expect(link.className).not.toContain('text-link')
  }

  const leituras = screen.getByRole('link', { name: 'Leituras recentes' })
  expect(leituras.getAttribute('href')).toBe('/blog/livros-recomendados')
  expect(leituras.getAttribute('target')).toBeNull()

  const setup = screen.getByRole('link', { name: 'Usos' })
  expect(setup.getAttribute('href')).toBe('/blog/ferramentas-apps-e-setup')

  expect(
    screen.getByText(`© ${new Date().getFullYear()} ${siteName}`),
  ).toBeTruthy()
  const privacy = screen.getByRole('link', { name: 'Privacidade' })
  expect(privacy.getAttribute('href')).toBe('/privacy')
  expect(privacy.getAttribute('target')).toBeNull()

  expect(screen.getByText('Made with love in Gravataí 🇧🇷')).toBeTruthy()

  const shell = document.querySelector('footer > div')
  expect(shell?.className).toContain('items-center')
  expect(shell?.className).toContain('text-center')

  const links = document.querySelector('footer ul')
  expect(links?.className).toContain('text-caption')
  expect(links?.className).not.toContain('text-body')
})

test('labels the privacy link in English', () => {
  renderFooter('en')

  expect(screen.getByRole('link', { name: 'Privacy' }).getAttribute('href')).toBe(
    '/en/privacy',
  )
  expect(screen.queryByRole('link', { name: 'Leituras recentes' })).toBeNull()
})
