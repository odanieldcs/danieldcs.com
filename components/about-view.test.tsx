import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import {
  InterfaceLanguageProvider,
  useInterfaceLanguage,
} from '@/components/interface-language-provider'
import { INTERFACE_LANGUAGE_COOKIE_NAME } from '@/lib/i18n/types'
import { contactEmail, linkedInProfileUrl } from '@/lib/site'
import { AboutView } from './about-view'

vi.mock('next/image', () => ({
  default: function MockImage({ alt, src }: { alt: string; src: string }) {
    return <img alt={alt} src={src} />
  },
}))

afterEach(() => {
  cleanup()
  // biome-ignore lint/suspicious/noDocumentCookie: test cleanup of the jsdom cookie jar
  document.cookie = `${INTERFACE_LANGUAGE_COOKIE_NAME}=; Path=/; Max-Age=0`
  document.documentElement.lang = ''
})

function renderAbout(language: 'pt' | 'en' = 'pt') {
  return render(
    <InterfaceLanguageProvider initialLanguage={language}>
      <AboutView />
    </InterfaceLanguageProvider>,
  )
}

function sectionByHeading(name: string) {
  return screen.getByRole('heading', { level: 2, name }).closest('section')
}

test('renders the about page in Portuguese', () => {
  renderAbout()

  expect(
    screen.getByRole('heading', {
      level: 1,
      name: 'Entre código, produto e pessoas.',
    }),
  ).toBeTruthy()
  expect(screen.getByText('Sobre mim')).toBeTruthy()
  expect(screen.getByText('AI-Assisted Development')).toBeTruthy()
  expect(screen.queryByText('Tecnologia, aprendizado e troca.')).toBeNull()
  expect(
    screen
      .getByRole('img', {
        name: 'Retrato de Daniel Castro na Golden Gate',
      })
      .getAttribute('src'),
  ).toBe('/media/personal/daniel_castro_profile_2.jpg')

  const experience = sectionByHeading('Experiência')
  const timelineItems = experience?.querySelectorAll('ol > li') ?? []
  expect(timelineItems).toHaveLength(4)
  expect(
    screen.getByRole('heading', { level: 3, name: 'Staff Software Engineer' }),
  ).toBeTruthy()
  expect(screen.getByText('Curebase')).toBeTruthy()
  expect(screen.getByText('Estados Unidos · remoto · contrato')).toBeTruthy()
  for (const item of timelineItems) {
    expect(item.querySelectorAll('p')).toHaveLength(2)
  }

  const linkedin = screen.getByRole('link', {
    name: 'Ver trajetória completa no LinkedIn',
  })
  expect(linkedin.getAttribute('href')).toBe(linkedInProfileUrl)
  expect(linkedin.getAttribute('target')).toBe('_blank')
  expect(linkedin.getAttribute('rel')).toBe('noopener noreferrer')
  expect(linkedin.querySelector('svg')).toBeTruthy()

  const repertoire = sectionByHeading('Como contribuo')
  expect(repertoire?.querySelectorAll('h3')).toHaveLength(6)
  expect(screen.getByText('Arquitetura')).toBeTruthy()
  expect(screen.getByText('AI-assisted development')).toBeTruthy()
  expect(screen.getByText('Mentoria')).toBeTruthy()
  expect(screen.getByText('Harness engineering')).toBeTruthy()
  expect(
    screen.getByRole('heading', { level: 3, name: 'Stack Principal' }),
  ).toBeTruthy()
  expect(screen.getByText(/Drizzle\/Prisma/)).toBeTruthy()
  expect(
    screen.getByRole('heading', { level: 3, name: 'Idiomas' }),
  ).toBeTruthy()
  expect(screen.getByText('Português · Inglês')).toBeTruthy()

  const pillar = screen.getByText('AI-Assisted Development')
  expect(pillar.closest('ul')).toBeNull()
  expect(pillar.parentElement?.className).toContain('text-sm')
  expect(pillar.parentElement?.className).not.toContain('rounded-full')

  const personal = sectionByHeading('Corrida como parte da rotina.')
  expect(personal?.className).toContain('border-y')
  expect(personal?.className).not.toContain('bg-trail')
  expect(
    screen.getByText(/Sou corredor amador e treino com regularidade/),
  ).toBeTruthy()

  const contact = screen.getByRole('link', { name: 'Entre em contato' })
  expect(contact.getAttribute('href')).toBe(`mailto:${contactEmail}`)
  expect(contact.getAttribute('href')).not.toContain('subject')
  expect(
    screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('mailto:')),
  ).toHaveLength(1)
  expect(
    screen
      .getAllByRole('link')
      .some((link) => link.getAttribute('href')?.includes('/contact')),
  ).toBe(false)
})

test('renders English copy when the interface language is en', () => {
  renderAbout('en')

  expect(
    screen.getByRole('heading', {
      level: 1,
      name: 'Between code, product and people.',
    }),
  ).toBeTruthy()
  expect(
    screen.getByRole('heading', { level: 2, name: 'Experience' }),
  ).toBeTruthy()
  expect(
    screen.getByRole('heading', { level: 2, name: 'How I contribute' }),
  ).toBeTruthy()
  expect(
    screen.getByRole('heading', {
      level: 2,
      name: 'Running as part of the routine.',
    }),
  ).toBeTruthy()
  expect(
    screen.getByRole('heading', { level: 2, name: "Let's talk." }),
  ).toBeTruthy()
  expect(screen.getByText('AI-Assisted Development')).toBeTruthy()
  expect(screen.queryByText('Technology, learning, and exchange.')).toBeNull()
  expect(
    screen.getByRole('img', {
      name: 'Portrait of Daniel Castro at the Golden Gate Bridge',
    }),
  ).toBeTruthy()
  expect(screen.getByText('Curebase')).toBeTruthy()
  expect(screen.getByText('United States · remote · contract')).toBeTruthy()
  expect(screen.getByText('Architecture')).toBeTruthy()
  expect(screen.getByText('Portuguese · English')).toBeTruthy()

  const linkedin = screen.getByRole('link', {
    name: 'See the full path on LinkedIn',
  })
  expect(linkedin.getAttribute('href')).toBe(linkedInProfileUrl)

  const contact = screen.getByRole('link', { name: 'Get in touch' })
  expect(contact.getAttribute('href')).toBe(`mailto:${contactEmail}`)
  expect(contact.getAttribute('href')).not.toContain('subject')
  expect(screen.queryByRole('heading', { name: 'Experiência' })).toBeNull()
})

function LanguageToggle() {
  const { setLanguage } = useInterfaceLanguage()

  return (
    <button type="button" onClick={() => setLanguage('en')}>
      Switch to English
    </button>
  )
}

test('updates About copy when the interface language changes', () => {
  render(
    <InterfaceLanguageProvider initialLanguage="pt">
      <LanguageToggle />
      <AboutView />
    </InterfaceLanguageProvider>,
  )

  expect(
    screen.getByRole('heading', { level: 2, name: 'Experiência' }),
  ).toBeTruthy()
  expect(
    screen.getByRole('link', { name: 'Entre em contato' }).getAttribute('href'),
  ).toBe(`mailto:${contactEmail}`)

  fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }))

  expect(
    screen.getByRole('heading', {
      level: 1,
      name: 'Between code, product and people.',
    }),
  ).toBeTruthy()
  expect(
    screen.getByRole('heading', { level: 2, name: 'Experience' }),
  ).toBeTruthy()
  expect(
    screen.getByRole('link', { name: 'Get in touch' }).getAttribute('href'),
  ).toBe(`mailto:${contactEmail}`)
  expect(
    screen.getByRole('img', {
      name: 'Portrait of Daniel Castro at the Golden Gate Bridge',
    }),
  ).toBeTruthy()
  expect(screen.queryByRole('heading', { name: 'Como contribuo' })).toBeNull()
})
