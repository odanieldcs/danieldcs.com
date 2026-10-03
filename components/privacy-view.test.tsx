import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { contactEmail } from '@/lib/site'
import { PrivacyView } from './privacy-view'

test('shows the last updated date and contact email', () => {
  render(<PrivacyView />)

  expect(screen.getByText(/Última atualização: 3 de outubro de 2026/)).toBeTruthy()
  const mailLinks = screen.getAllByRole('link', { name: contactEmail })
  expect(mailLinks.length).toBeGreaterThan(0)
  for (const link of mailLinks) {
    expect(link.getAttribute('href')).toBe(`mailto:${contactEmail}`)
  }
})
