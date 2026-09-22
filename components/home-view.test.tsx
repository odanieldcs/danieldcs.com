import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, expect, test, vi } from 'vitest'
import {
  InterfaceLanguageProvider,
  useInterfaceLanguage,
} from '@/components/interface-language-provider'
import { INTERFACE_LANGUAGE_COOKIE_NAME } from '@/lib/i18n/types'
import { HomeView, type HomePostSummary } from './home-view'

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

const posts: HomePostSummary[] = [
  {
    slug: 'content-system',
    title: 'Como o content system renderiza um artigo',
    date: '2026-09-21T00:00:00.000Z',
    description: 'Um passeio pelo pipeline de ponta a ponta.',
    language: 'pt',
  },
]

afterEach(() => {
  cleanup()
  // biome-ignore lint/suspicious/noDocumentCookie: test cleanup of the jsdom cookie jar
  document.cookie = `${INTERFACE_LANGUAGE_COOKIE_NAME}=; Path=/; Max-Age=0`
  document.documentElement.lang = ''
})

function renderHome(language: 'pt' | 'en' = 'pt') {
  return render(
    <InterfaceLanguageProvider initialLanguage={language}>
      <HomeView posts={posts} />
    </InterfaceLanguageProvider>,
  )
}

test('renders identity, recent posts, and the Trilha CTA in Portuguese', () => {
  renderHome()

  expect(
    screen.getByRole('heading', { level: 1, name: 'Daniel Castro' }),
  ).toBeTruthy()
  expect(screen.getByText('Software Engineer & Builder')).toBeTruthy()
  expect(screen.getByText('Engenheiro Full-Stack')).toBeTruthy()
  expect(screen.getByText('Builder')).toBeTruthy()
  expect(screen.getByText('Corredor')).toBeTruthy()
  expect(
    screen.getByRole('img', {
      name: 'Retrato de Daniel Castro na Golden Gate',
    }),
  ).toBeTruthy()
  expect(
    screen.getByText(
      'Construo produtos e sistemas de software de ponta a ponta e escrevo sobre o que aprendo no caminho.',
    ),
  ).toBeTruthy()
  expect(
    screen.getByRole('heading', { level: 2, name: 'Escrita recente' }),
  ).toBeTruthy()
  expect(
    screen
      .getByRole('link', { name: 'Como o content system renderiza um artigo' })
      .getAttribute('href'),
  ).toBe('/blog/content-system')
  expect(
    screen.getByText('Um passeio pelo pipeline de ponta a ponta.'),
  ).toBeTruthy()
  expect(document.querySelector('time')?.getAttribute('dateTime')).toBe(
    '2026-09-21T00:00:00.000Z',
  )
  expect(document.querySelector('time')?.textContent).toMatch(/set/i)
  expect(
    screen.getByRole('link', { name: 'Ver a Trilha' }).getAttribute('href'),
  ).toBe('/trilha')
})

test('renders English copy when the interface language is en', () => {
  renderHome('en')

  expect(screen.getByText('Software Engineer & Builder')).toBeTruthy()
  expect(screen.getByText('Full-Stack Engineer')).toBeTruthy()
  expect(screen.getByText('Builder')).toBeTruthy()
  expect(screen.getByText('Runner')).toBeTruthy()
  expect(
    screen.getByRole('img', {
      name: 'Portrait of Daniel Castro at the Golden Gate Bridge',
    }),
  ).toBeTruthy()
  expect(
    screen.getByText(
      'I build software products and systems end to end, and write about what I learn along the way.',
    ),
  ).toBeTruthy()
  expect(
    screen.getByRole('heading', { level: 2, name: 'Recent writing' }),
  ).toBeTruthy()
  expect(document.querySelector('time')?.textContent).toMatch(/Sep/i)
  expect(
    screen.getByRole('link', { name: 'See the Trilha' }).getAttribute('href'),
  ).toBe('/trilha')
  expect(screen.queryByRole('heading', { name: 'Escrita recente' })).toBeNull()
})

function LanguageToggle() {
  const { setLanguage } = useInterfaceLanguage()

  return (
    <button type="button" onClick={() => setLanguage('en')}>
      Switch to English
    </button>
  )
}

test('updates Home copy when the interface language changes', () => {
  render(
    <InterfaceLanguageProvider initialLanguage="pt">
      <LanguageToggle />
      <HomeView posts={posts} />
    </InterfaceLanguageProvider>,
  )

  expect(
    screen.getByRole('heading', { level: 2, name: 'Escrita recente' }),
  ).toBeTruthy()
  expect(screen.getByText('Engenheiro Full-Stack')).toBeTruthy()

  fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }))

  expect(
    screen.getByRole('heading', { level: 2, name: 'Recent writing' }),
  ).toBeTruthy()
  expect(screen.getByText('Full-Stack Engineer')).toBeTruthy()
  expect(
    screen.getByRole('img', {
      name: 'Portrait of Daniel Castro at the Golden Gate Bridge',
    }),
  ).toBeTruthy()
  expect(
    screen.getByRole('link', { name: 'See the Trilha' }).getAttribute('href'),
  ).toBe('/trilha')
})
