import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import {
  InterfaceLanguageProvider,
  useInterfaceLanguage,
} from '@/components/interface-language-provider'
import { INTERFACE_LANGUAGE_COOKIE_NAME } from '@/lib/i18n/types'
import { contactEmail } from '@/lib/site'
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
      name: 'Entre sistemas e pessoas, construo caminhos mais simples.',
    }),
  ).toBeTruthy()
  expect(screen.getByText('Sobre mim')).toBeTruthy()
  expect(screen.getByText('IA aplicada')).toBeTruthy()
  expect(screen.getByText('Tecnologia, aprendizado e troca.')).toBeTruthy()
  expect(
    screen
      .getByRole('img', {
        name: 'Daniel Castro palestrando no palco, com microfone',
      })
      .getAttribute('src'),
  ).toBe('/media/personal/daniel_castro_profile_3.jpg')

  const experience = sectionByHeading('Experiência')
  const timelineItems = experience?.querySelectorAll('ol > li') ?? []
  expect(timelineItems).toHaveLength(4)
  expect(
    screen.getByRole('heading', { level: 3, name: 'Staff Software Engineer' }),
  ).toBeTruthy()
  expect(
    screen.getByText('Curebase / Estados Unidos · remoto'),
  ).toBeTruthy()
  for (const item of timelineItems) {
    expect(item.querySelectorAll('p')).toHaveLength(2)
  }

  const linkedin = screen.getByRole('link', {
    name: 'Ver trajetória completa no LinkedIn',
  })
  expect(linkedin.getAttribute('href')).toBe(
    'https://www.linkedin.com/in/odanieldcs',
  )
  expect(linkedin.getAttribute('target')).toBe('_blank')
  expect(linkedin.getAttribute('rel')).toBe('noopener noreferrer')
  expect(linkedin.querySelector('svg')).toBeTruthy()

  const repertoire = sectionByHeading('Como contribuo')
  expect(repertoire?.querySelectorAll('h3')).toHaveLength(4)
  expect(screen.getByText('Arquitetura de software')).toBeTruthy()
  expect(screen.getByText('AI-assisted development')).toBeTruthy()
  expect(screen.getAllByText('Mentoria')).toHaveLength(2)
  expect(screen.getByText('Planejamento de entregas')).toBeTruthy()
  expect(screen.getByText('Idiomas:')).toBeTruthy()
  expect(screen.getByText('Português · Inglês')).toBeTruthy()

  const pillar = screen.getByText('IA aplicada').closest('ul')
  expect(pillar?.className).toContain('text-caption')
  expect(pillar?.className).toContain('text-muted')
  expect(pillar?.className).not.toContain('rounded-full')

  const personal = sectionByHeading('Corrida como parte da rotina.')
  expect(personal?.className).toContain('bg-trail')
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
      name: 'Between systems and people, I build simpler paths.',
    }),
  ).toBeTruthy()
  expect(screen.getByRole('heading', { level: 2, name: 'Experience' })).toBeTruthy()
  expect(
    screen.getByRole('heading', { level: 2, name: 'How I contribute' }),
  ).toBeTruthy()
  expect(
    screen.getByRole('heading', {
      level: 2,
      name: 'Running as part of the routine.',
    }),
  ).toBeTruthy()
  expect(screen.getByRole('heading', { level: 2, name: "Let's talk." })).toBeTruthy()
  expect(screen.getByText('Applied AI')).toBeTruthy()
  expect(screen.getByText('Technology, learning, and exchange.')).toBeTruthy()
  expect(
    screen.getByRole('img', {
      name: 'Daniel Castro speaking on stage, holding a microphone',
    }),
  ).toBeTruthy()
  expect(screen.getByText('Curebase / United States · remote')).toBeTruthy()
  expect(screen.getByText('Software architecture')).toBeTruthy()
  expect(screen.getByText('Portuguese · English')).toBeTruthy()

  const linkedin = screen.getByRole('link', {
    name: 'See the full path on LinkedIn',
  })
  expect(linkedin.getAttribute('href')).toBe(
    'https://www.linkedin.com/in/odanieldcs',
  )

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

  expect(screen.getByRole('heading', { level: 2, name: 'Experiência' })).toBeTruthy()
  expect(
    screen
      .getByRole('link', { name: 'Entre em contato' })
      .getAttribute('href'),
  ).toBe(`mailto:${contactEmail}`)

  fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }))

  expect(
    screen.getByRole('heading', {
      level: 1,
      name: 'Between systems and people, I build simpler paths.',
    }),
  ).toBeTruthy()
  expect(screen.getByRole('heading', { level: 2, name: 'Experience' })).toBeTruthy()
  expect(
    screen
      .getByRole('link', { name: 'Get in touch' })
      .getAttribute('href'),
  ).toBe(`mailto:${contactEmail}`)
  expect(
    screen.getByRole('img', {
      name: 'Daniel Castro speaking on stage, holding a microphone',
    }),
  ).toBeTruthy()
  expect(screen.queryByRole('heading', { name: 'Como contribuo' })).toBeNull()
})
