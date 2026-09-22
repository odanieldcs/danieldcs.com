import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { siteName } from '@/lib/site'
import { Footer } from './footer'

test('renders email, LinkedIn, and the current year', () => {
  render(<Footer />)

  const email = screen.getByRole('link', { name: 'hi@danieldcs.com' })
  expect(email.getAttribute('href')).toBe('mailto:hi@danieldcs.com')
  expect(email.getAttribute('target')).toBe('_blank')
  expect(email.getAttribute('rel')).toBe('noopener noreferrer')

  const linkedIn = screen.getByRole('link', { name: 'LinkedIn' })
  expect(linkedIn.getAttribute('href')).toBe(
    'https://www.linkedin.com/in/odanieldcs',
  )
  expect(linkedIn.getAttribute('target')).toBe('_blank')
  expect(linkedIn.getAttribute('rel')).toBe('noopener noreferrer')

  expect(
    screen.getByText(`© ${new Date().getFullYear()} ${siteName}`),
  ).toBeTruthy()
})
