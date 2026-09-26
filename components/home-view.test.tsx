import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, expect, test, vi } from 'vitest'
import {
  InterfaceLanguageProvider,
  useInterfaceLanguage,
} from '@/components/interface-language-provider'
import { INTERFACE_LANGUAGE_COOKIE_NAME } from '@/lib/i18n/types'
import { type HomePostSummary, HomeView } from './home-view'

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
    tag: 'content',
  },
]

afterEach(() => {
  cleanup()
  // biome-ignore lint/suspicious/noDocumentCookie: test cleanup of the jsdom cookie jar
  document.cookie = `${INTERFACE_LANGUAGE_COOKIE_NAME}=; Path=/; Max-Age=0`
  document.documentElement.lang = ''
})

function renderHome(language: 'pt' | 'en' = 'pt', nextPosts = posts) {
  return render(
    <InterfaceLanguageProvider initialLanguage={language}>
      <HomeView posts={nextPosts} />
    </InterfaceLanguageProvider>,
  )
}

test('renders the editorial home and recent posts in Portuguese', () => {
  renderHome()

  const headline = screen.getByRole('heading', {
    level: 1,
    name: 'Criando e compartilhando, de Dev para Dev.',
  })
  expect(headline).toBeTruthy()
  expect(
    screen.queryByRole('heading', { level: 1, name: 'Daniel Castro' }),
  ).toBeNull()
  expect(headline.closest('section')?.querySelector('a[href="/trilha"]')).toBe(
    null,
  )
  expect(screen.queryByRole('link', { name: 'Ver a Trilha' })).toBeNull()
  expect(screen.queryByRole('link', { name: 'Ler o blog' })).toBeNull()
  expect(screen.queryByRole('link', { name: 'Ver todos' })).toBeNull()

  expect(screen.getByText('Engenheiro · Builder · Corredor')).toBeTruthy()
  expect(screen.getByText('01')).toBeTruthy()
  expect(screen.getByText('02')).toBeTruthy()
  expect(screen.getByText('03')).toBeTruthy()
  expect(screen.getByText('Engenheiro Full-Stack')).toBeTruthy()
  expect(screen.getByText('Builder')).toBeTruthy()
  expect(screen.getByText('Corredor')).toBeTruthy()
  expect(
    screen.getByRole('img', {
      name: 'Daniel Castro palestrando no palco do TDC Floripa em 2026, com microfone',
    }),
  ).toBeTruthy()
  expect(screen.getByText('Tecnologia, aprendizado e troca.')).toBeTruthy()
  expect(
    screen.getByText('Olá, me chamo Daniel, sou um desenvolvedor full-stack.'),
  ).toBeTruthy()
  expect(
    screen.getByText(
      'Planejo, crio e torno softwares mais acessíveis no dia a dia. Acredito que a tecnologia pode e deve ser usada para melhorar a vida das pessoas. Quando não estou codando, estou em movimento.',
    ),
  ).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Saber mais' }).getAttribute('href')).toBe(
    '/about',
  )
  expect(screen.getByText('Notas de engenharia')).toBeTruthy()
  expect(
    screen.getByRole('heading', { level: 2, name: 'Escrita recente' }),
  ).toBeTruthy()
  expect(screen.getByText('content')).toBeTruthy()
  const articleLink = screen.getByRole('link', { name: /Ler artigo/ })
  expect(articleLink.getAttribute('href')).toBe('/blog/content-system')
  expect(articleLink.className).toContain('group')
  expect(articleLink.querySelector('a')).toBeNull()
  expect(articleLink.querySelector('svg')).toBeTruthy()
  expect(articleLink.textContent).toContain(
    'Como o content system renderiza um artigo',
  )
  expect(
    screen.getByText('Um passeio pelo pipeline de ponta a ponta.'),
  ).toBeTruthy()
  expect(
    screen.getByText('Um passeio pelo pipeline de ponta a ponta.').className,
  ).not.toContain('truncate')
  expect(document.querySelector('time')?.getAttribute('dateTime')).toBe(
    '2026-09-21T00:00:00.000Z',
  )
  expect(document.querySelector('time')?.textContent).toBe('21 set. 2026')
  expect(
    screen.queryByRole('heading', {
      level: 2,
      name: 'Um caminho de estudo e prática.',
    }),
  ).toBeNull()
})

test('renders English copy when the interface language is en', () => {
  renderHome('en')

  expect(
    screen.getByRole('heading', {
      level: 1,
      name: 'Creating and sharing, from dev to dev.',
    }),
  ).toBeTruthy()
  expect(screen.getByText('Engineer · Builder · Runner')).toBeTruthy()
  expect(screen.getByText('Full-Stack Engineer')).toBeTruthy()
  expect(screen.getByText('Builder')).toBeTruthy()
  expect(screen.getByText('Runner')).toBeTruthy()
  expect(
    screen.getByRole('img', {
      name: 'Daniel Castro speaking on stage at TDC Floripa in 2026, holding a microphone',
    }),
  ).toBeTruthy()
  expect(
    screen.getByText("Hi, I'm Daniel, a full-stack developer."),
  ).toBeTruthy()
  expect(
    screen.getByText(
      "I plan, build, and make software more accessible in everyday life. I believe technology can and should be used to improve people's lives. When I'm not coding, I'm out moving.",
    ),
  ).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Learn more' }).getAttribute('href')).toBe(
    '/about',
  )
  expect(screen.getByText('Engineering notes')).toBeTruthy()
  expect(
    screen.getByRole('heading', { level: 2, name: 'Recent writing' }),
  ).toBeTruthy()
  expect(document.querySelector('time')?.textContent).toBe('21 Sep. 2026')
  const articleLink = screen.getByRole('link', { name: /Read article/ })
  expect(articleLink.getAttribute('href')).toBe('/blog/content-system')
  expect(articleLink.querySelector('svg')).toBeTruthy()
  expect(screen.queryByRole('link', { name: 'See the Trilha' })).toBeNull()
  expect(screen.queryByRole('heading', { name: 'Escrita recente' })).toBeNull()
})

test('omits the tag label when the post has no tag', () => {
  renderHome('pt', [
    {
      slug: 'content-system',
      title: 'Como o content system renderiza um artigo',
      date: '2026-09-21T00:00:00.000Z',
      description: 'Um passeio pelo pipeline de ponta a ponta.',
      language: 'pt',
    },
  ])

  expect(screen.queryByText('content')).toBeNull()
  expect(document.querySelector('time')).toBeTruthy()
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
    screen.getByRole('heading', {
      level: 1,
      name: 'Creating and sharing, from dev to dev.',
    }),
  ).toBeTruthy()
  expect(screen.getByText('Engineer · Builder · Runner')).toBeTruthy()
  expect(
    screen.getByRole('heading', { level: 2, name: 'Recent writing' }),
  ).toBeTruthy()
  expect(screen.getByText('Full-Stack Engineer')).toBeTruthy()
  expect(
    screen.getByRole('img', {
      name: 'Daniel Castro speaking on stage at TDC Floripa in 2026, holding a microphone',
    }),
  ).toBeTruthy()
  expect(screen.queryByRole('link', { name: 'See the Trilha' })).toBeNull()
})
