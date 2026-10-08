import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { contactEmail } from '@/lib/site'
import { PrivacyView } from './privacy-view'

test('shows the last updated date and contact email', () => {
  render(<PrivacyView language="pt" />)

  expect(
    screen.getByText(/Última atualização: 6 de outubro de 2026/),
  ).toBeTruthy()
  expect(screen.getAllByText(/PostHog/).length).toBeGreaterThan(0)
  expect(screen.getByText(/Estados Unidos/)).toBeTruthy()
  expect(screen.queryByText(/Não coletamos páginas visitadas/)).toBeNull()
  const mailLinks = screen.getAllByRole('link', { name: contactEmail })
  expect(mailLinks.length).toBeGreaterThan(0)
  for (const link of mailLinks) {
    expect(link.getAttribute('href')).toBe(`mailto:${contactEmail}`)
  }
})
