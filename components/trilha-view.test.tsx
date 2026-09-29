import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { InterfaceLanguageProvider } from '@/components/interface-language-provider'
import { getTrilhaCopy } from '@/lib/i18n/pages'
import { trilhaWhatsAppUrl } from '@/lib/site'
import { TrilhaView } from './trilha-view'

afterEach(() => {
  cleanup()
})

function renderTrilha(language: 'pt' | 'en' = 'pt') {
  return render(
    <InterfaceLanguageProvider language={language}>
      <TrilhaView />
    </InterfaceLanguageProvider>,
  )
}

test('renders the Trilha page in Portuguese with a WhatsApp link and no form', () => {
  const { container } = renderTrilha()
  const copy = getTrilhaCopy('pt')

  expect(
    screen.getByRole('heading', { level: 1, name: copy.title }),
  ).toBeTruthy()
  expect(screen.getByText(copy.eyebrow)).toBeTruthy()
  for (const item of copy.pillars.items) {
    expect(
      screen.getByRole('heading', { level: 3, name: item.title }),
    ).toBeTruthy()
  }

  const whatsapp = screen.getByRole('link', { name: copy.cta.button })
  expect(whatsapp.getAttribute('href')).toBe(
    trilhaWhatsAppUrl(copy.cta.whatsappMessage),
  )
  expect(whatsapp.getAttribute('target')).toBe('_blank')
  expect(whatsapp.getAttribute('rel')).toBe('noopener noreferrer')

  expect(container.querySelector('form')).toBeNull()
  expect(container.querySelector('input')).toBeNull()

  const band = screen.getByRole('heading', { level: 1 }).closest('section')
  expect(band?.className).toContain('bg-trail')
})

test('renders English copy and the English WhatsApp message', () => {
  const { container } = renderTrilha('en')
  const copy = getTrilhaCopy('en')

  expect(
    screen.getByRole('heading', { level: 1, name: copy.title }),
  ).toBeTruthy()
  for (const item of copy.pillars.items) {
    expect(
      screen.getByRole('heading', { level: 3, name: item.title }),
    ).toBeTruthy()
  }

  expect(
    screen.getByRole('link', { name: copy.cta.button }).getAttribute('href'),
  ).toBe(trilhaWhatsAppUrl(copy.cta.whatsappMessage))
  expect(container.querySelector('form')).toBeNull()
  expect(container.querySelector('input')).toBeNull()
})

test('renders the English eyebrow when the interface language is en', () => {
  renderTrilha('en')

  expect(screen.getByText('The Trilha · In progress')).toBeTruthy()
  expect(
    screen.getByRole('heading', {
      level: 1,
      name: 'Guided by someone who applies it every day.',
    }),
  ).toBeTruthy()
  expect(screen.queryByText('A Trilha · Em construção')).toBeNull()
})
