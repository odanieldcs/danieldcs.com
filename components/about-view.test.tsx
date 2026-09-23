import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
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

function mailto(subject: string) {
  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}`
}

test('renders the five about sections in Portuguese', () => {
  renderAbout()

  expect(
    screen.getByRole('heading', {
      level: 1,
      name: 'Trajetória, ofício e colaboração.',
    }),
  ).toBeTruthy()
  expect(
    screen.getByRole('heading', { level: 2, name: 'Trajetória profissional' }),
  ).toBeTruthy()
  expect(
    screen.getByRole('heading', { level: 2, name: 'Habilidades' }),
  ).toBeTruthy()
  expect(screen.getByRole('heading', { level: 2, name: 'Pessoal' })).toBeTruthy()
  expect(
    screen.getByRole('heading', { level: 2, name: 'Colaboração' }),
  ).toBeTruthy()

  expect(screen.getByText('Corredor')).toBeTruthy()
  expect(
    screen.getByRole('heading', { level: 3, name: 'Engenheiro de software' }),
  ).toBeTruthy()
  expect(
    screen.getByRole('heading', { level: 3, name: 'Palestrante' }),
  ).toBeTruthy()
  expect(
    screen
      .getByRole('heading', { level: 2, name: 'Trajetória profissional' })
      .closest('section')
      ?.querySelectorAll('li'),
  ).toHaveLength(4)
  expect(
    screen.getByRole('img', {
      name: 'Daniel Castro palestrando no palco, com microfone',
    }).getAttribute('src'),
  ).toBe('/media/personal/daniel_castro_profile_1.png')

  expect(screen.getAllByRole('heading', { level: 3, name: 'Educador' })).toHaveLength(
    1,
  )
  expect(screen.getAllByText('[placeholder]').length).toBeGreaterThan(0)
  expect(screen.getByText('TypeScript')).toBeTruthy()
  expect(screen.getByText('Constância')).toBeTruthy()
  expect(screen.getByText('Gravataí, Brasil')).toBeTruthy()

  const consultoria = screen.getByRole('link', { name: /Consultoria/ })
  expect(consultoria.getAttribute('href')).toBe(mailto('Consultoria'))
  expect(consultoria.className).toContain('rounded-lg')
  expect(consultoria.querySelector('svg')).toBeTruthy()

  const oportunidade = screen.getByRole('link', {
    name: /Oportunidades profissionais/,
  })
  expect(oportunidade.getAttribute('href')).toBe(
    mailto('Oportunidade profissional'),
  )
  expect(
    screen.getByRole('link', { name: /Colaborações/ }).getAttribute('href'),
  ).toBe(mailto('Colaboração'))

  expect(screen.getAllByRole('link', { name: /Escrever/ })).toHaveLength(6)
  expect(
    screen.getByRole('link', { name: contactEmail }).getAttribute('href'),
  ).toBe(`mailto:${contactEmail}`)
  expect(
    screen
      .getAllByRole('link')
      .some((link) => link.getAttribute('href')?.includes('/contact')),
  ).toBe(false)
  expect(
    screen.getByText(
      'Se preferir as redes, LinkedIn, GitHub, YouTube e Instagram estão no rodapé.',
    ),
  ).toBeTruthy()
})

test('renders English copy when the interface language is en', () => {
  renderAbout('en')

  expect(
    screen.getByRole('heading', {
      level: 1,
      name: 'Path, craft, and collaboration.',
    }),
  ).toBeTruthy()
  expect(
    screen.getByRole('heading', { level: 2, name: 'Professional path' }),
  ).toBeTruthy()
  expect(screen.getByRole('heading', { level: 2, name: 'Skills' })).toBeTruthy()
  expect(
    screen.getByRole('heading', { level: 2, name: 'Personal' }),
  ).toBeTruthy()
  expect(
    screen.getByRole('heading', { level: 2, name: 'Collaboration' }),
  ).toBeTruthy()
  expect(screen.getByText('Software Engineer')).toBeTruthy()
  expect(screen.getByText('Runner')).toBeTruthy()
  expect(
    screen.getByRole('img', {
      name: 'Daniel Castro speaking on stage, holding a microphone',
    }),
  ).toBeTruthy()
  expect(screen.getByText('Product engineering')).toBeTruthy()
  expect(screen.getByText('Consistency')).toBeTruthy()
  expect(screen.getByText('Gravataí, Brazil')).toBeTruthy()

  expect(screen.getByRole('link', { name: /Consulting/ }).getAttribute('href')).toBe(
    mailto('Consulting'),
  )
  expect(
    screen
      .getByRole('link', { name: /Professional opportunities/ })
      .getAttribute('href'),
  ).toBe(mailto('Professional opportunity'))
  expect(screen.getAllByRole('link', { name: /Write/ })).toHaveLength(6)
  expect(screen.queryByRole('heading', { name: 'Trajetória profissional' })).toBeNull()
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
    screen.getByRole('heading', { level: 2, name: 'Trajetória profissional' }),
  ).toBeTruthy()
  expect(
    screen.getByRole('link', { name: /Palestras/ }).getAttribute('href'),
  ).toBe(mailto('Palestra'))

  fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }))

  expect(
    screen.getByRole('heading', {
      level: 1,
      name: 'Path, craft, and collaboration.',
    }),
  ).toBeTruthy()
  expect(
    screen.getByRole('heading', { level: 2, name: 'Professional path' }),
  ).toBeTruthy()
  expect(screen.getByRole('link', { name: /Talks/ }).getAttribute('href')).toBe(
    mailto('Talk'),
  )
  expect(
    screen.getByRole('img', {
      name: 'Daniel Castro speaking on stage, holding a microphone',
    }),
  ).toBeTruthy()
  expect(screen.queryByRole('heading', { name: 'Habilidades' })).toBeNull()
})
