import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { siteName } from '@/lib/site'
import { Footer } from './footer'

const socialLinks = [
  ['LinkedIn', 'https://www.linkedin.com/in/odanieldcs'],
  ['GitHub', 'https://github.com/odanieldcs'],
  ['YouTube', 'https://www.youtube.com/@odanieldcs'],
  ['Instagram', 'https://www.instagram.com/odanieldcs'],
] as const

test('renders social links, tagline, and the current year', () => {
  render(<Footer />)

  expect(screen.queryByRole('link', { name: 'hi@danieldcs.com' })).toBeNull()
  expect(screen.queryByText(/mailto:/)).toBeNull()

  for (const [name, href] of socialLinks) {
    const link = screen.getByRole('link', { name })
    expect(link.getAttribute('href')).toBe(href)
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
  }

  expect(
    screen.getByText(`© ${new Date().getFullYear()} ${siteName}`),
  ).toBeTruthy()
  expect(screen.getByText('Made with love in Gravataí 🇧🇷')).toBeTruthy()

  const shell = document.querySelector('footer > div')
  expect(shell?.className).toContain('items-center')
  expect(shell?.className).toContain('text-center')
})
