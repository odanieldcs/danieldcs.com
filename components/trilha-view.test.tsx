import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import {
  InterfaceLanguageProvider,
  useInterfaceLanguage,
} from '@/components/interface-language-provider'
import { getTrilhaCopy } from '@/lib/i18n/pages'
import { INTERFACE_LANGUAGE_COOKIE_NAME } from '@/lib/i18n/types'
import { trilhaWhatsAppUrl } from '@/lib/site'
import { TrilhaView } from './trilha-view'

afterEach(() => {
  cleanup()
  // biome-ignore lint/suspicious/noDocumentCookie: test cleanup of the jsdom cookie jar
  document.cookie = `${INTERFACE_LANGUAGE_COOKIE_NAME}=; Path=/; Max-Age=0`
  document.documentElement.lang = ''
})

function renderTrilha(language: 'pt' | 'en' = 'pt') {
  return render(
    <InterfaceLanguageProvider initialLanguage={language}>
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

function LanguageToggle() {
  const { setLanguage } = useInterfaceLanguage()

  return (
    <button type="button" onClick={() => setLanguage('en')}>
      Switch to English
    </button>
  )
}

test('updates Trilha copy when the interface language changes', () => {
  render(
    <InterfaceLanguageProvider initialLanguage="pt">
      <LanguageToggle />
      <TrilhaView />
    </InterfaceLanguageProvider>,
  )

  expect(screen.getByText('A Trilha · Em construção')).toBeTruthy()

  fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }))

  expect(screen.getByText('The Trilha · In progress')).toBeTruthy()
  expect(
    screen.getByRole('heading', {
      level: 1,
      name: 'Learning guided by someone who applies it every day.',
    }),
  ).toBeTruthy()
  expect(screen.queryByText('A Trilha · Em construção')).toBeNull()
})
