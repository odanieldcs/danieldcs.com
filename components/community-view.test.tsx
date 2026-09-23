import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import {
  InterfaceLanguageProvider,
  useInterfaceLanguage,
} from '@/components/interface-language-provider'
import { INTERFACE_LANGUAGE_COOKIE_NAME } from '@/lib/i18n/types'
import { type CommunityEntryView, CommunityView } from './community-view'

const entries: CommunityEntryView[] = [
  {
    slug: 'exemplo-2026-09-palestra',
    title: 'Exemplo de palestra',
    description: 'Entrada de exemplo para exercitar a timeline.',
    date: '2026-09-23T00:00:00.000Z',
    type: 'talk',
    language: 'pt',
    eventName: 'Encontro de exemplo',
    link: 'https://example.com/palestra',
  },
  {
    slug: 'exemplo-2026-05-workshop',
    title: 'Exemplo de workshop',
    description: 'Workshop de exemplo, sem link.',
    date: '2026-05-03T00:00:00.000Z',
    type: 'workshop',
    language: 'en',
    cover: 'foto.jpg',
  },
  {
    slug: 'exemplo-2025-01-evento',
    title: 'Exemplo de evento',
    description: 'Evento de exemplo.',
    date: '2025-01-11T00:00:00.000Z',
    type: 'event',
    language: 'pt',
  },
  {
    slug: 'exemplo-2024-06-outra',
    title: 'Exemplo de outra participação',
    description: 'Outra participação de exemplo.',
    date: '2024-06-07T00:00:00.000Z',
    type: 'other',
    language: 'pt',
  },
  {
    slug: 'exemplo-2023-03-evento',
    title: 'Exemplo de evento antigo',
    description: 'Entrada antiga de exemplo.',
    date: '2023-03-11T00:00:00.000Z',
    type: 'event',
    language: 'en',
    link: 'https://example.com/evento-antigo',
  },
]

afterEach(() => {
  cleanup()
  // biome-ignore lint/suspicious/noDocumentCookie: test cleanup of the jsdom cookie jar
  document.cookie = `${INTERFACE_LANGUAGE_COOKIE_NAME}=; Path=/; Max-Age=0`
  document.documentElement.lang = ''
})

function renderCommunity(
  language: 'pt' | 'en' = 'pt',
  nextEntries = entries,
) {
  return render(
    <InterfaceLanguageProvider initialLanguage={language}>
      <CommunityView entries={nextEntries} />
    </InterfaceLanguageProvider>,
  )
}

function yearSection(year: string) {
  return screen.getByRole('heading', { level: 2, name: year }).closest('section')
}

test('groups entries by year with date, type, title, and location', () => {
  renderCommunity()

  expect(
    screen.getByRole('heading', {
      level: 1,
      name: 'Palestras, workshops e encontros.',
    }),
  ).toBeTruthy()
  expect(screen.getByText('Comunidade')).toBeTruthy()

  const years = screen
    .getAllByRole('heading', { level: 2 })
    .map((heading) => heading.textContent)
  expect(years).toEqual(['2026', '2025', '2024', '2023'])

  const year2026 = yearSection('2026')
  const items = year2026?.querySelectorAll('ol > li') ?? []
  expect(items).toHaveLength(2)
  expect(items[0]?.textContent).toContain('Exemplo de palestra')
  expect(items[0]?.textContent).toContain('23 set. 2026')
  expect(items[0]?.textContent).toContain('Palestra')
  expect(items[0]?.textContent).toContain('Encontro de exemplo')
  expect(items[0]?.textContent).not.toContain(
    'Entrada de exemplo para exercitar a timeline.',
  )
  expect(items[1]?.textContent).toContain('Exemplo de workshop')
  expect(items[1]?.querySelector('a')).toBeNull()
  expect(screen.queryByRole('link', { name: 'Abrir link' })).toBeNull()

  const talkLink = within(year2026 as HTMLElement).getByRole('link', {
    name: /Exemplo de palestra/,
  })
  expect(talkLink.getAttribute('href')).toBe('https://example.com/palestra')
  expect(talkLink.getAttribute('target')).toBe('_blank')
  expect(talkLink.getAttribute('rel')).toBe('noopener noreferrer')
  expect(talkLink.querySelector('h3')?.textContent).toBe('Exemplo de palestra')

  expect(screen.queryByText('Nenhuma participação publicada ainda.')).toBeNull()
})

test('switches the same entries between list and grid', () => {
  renderCommunity()

  const listButton = screen.getByRole('button', { name: 'Lista' })
  const gridButton = screen.getByRole('button', { name: 'Grade' })
  expect(listButton.textContent).toBe('')
  expect(listButton.querySelector('svg')).toBeTruthy()
  expect(gridButton.querySelector('svg')).toBeTruthy()
  expect(listButton.getAttribute('aria-pressed')).toBe('true')
  const formatGroup = screen.getByRole('group', { name: 'Formato' })
  const listing = formatGroup.closest('.border-t')
  const switcherAnchor = formatGroup.parentElement
  expect(listing?.contains(screen.getByRole('heading', { level: 1 }))).toBe(false)
  expect(listing?.querySelector('h2')?.textContent).toBe('2026')
  expect(formatGroup.className).toContain('w-fit')
  expect(switcherAnchor?.className).toContain('right-0')
  expect(switcherAnchor?.className).toContain('-translate-y-1/2')
  expect(yearSection('2026')?.querySelector('ol')?.parentElement?.className).not.toContain(
    'animate-community-view-in',
  )
  expect(yearSection('2026')?.querySelector('ol')).toBeTruthy()

  fireEvent.click(gridButton)

  expect(gridButton.getAttribute('aria-pressed')).toBe('true')
  expect(listButton.getAttribute('aria-pressed')).toBe('false')
  const year2026 = yearSection('2026')
  expect(year2026?.querySelector('ol')).toBeNull()
  expect(year2026?.querySelector('ul')?.className).toContain('sm:grid-cols-2')
  expect(year2026?.querySelector('ul')?.parentElement?.className).toContain(
    'animate-community-view-in',
  )
  const card = within(year2026 as HTMLElement).getByRole('link', {
    name: /Exemplo de palestra/,
  })
  expect(card.getAttribute('href')).toBe('https://example.com/palestra')
  expect(
    within(year2026 as HTMLElement).getByRole('heading', {
      level: 3,
      name: 'Exemplo de workshop',
    }).closest('a'),
  ).toBeNull()

  fireEvent.click(listButton)

  expect(yearSection('2026')?.querySelector('ol')).toBeTruthy()
})

test('renders an empty state when there are no entries', () => {
  renderCommunity('pt', [])

  expect(
    screen.getByRole('heading', {
      level: 1,
      name: 'Palestras, workshops e encontros.',
    }),
  ).toBeTruthy()
  expect(screen.getByText('Nenhuma participação publicada ainda.')).toBeTruthy()
  expect(screen.queryByRole('heading', { level: 2 })).toBeNull()
  expect(screen.queryByRole('group', { name: 'Formato' })).toBeNull()
})

function LanguageToggle() {
  const { setLanguage } = useInterfaceLanguage()

  return (
    <button type="button" onClick={() => setLanguage('en')}>
      Switch to English
    </button>
  )
}

test('updates Community chrome when the interface language changes', () => {
  render(
    <InterfaceLanguageProvider initialLanguage="pt">
      <LanguageToggle />
      <CommunityView entries={entries} />
    </InterfaceLanguageProvider>,
  )

  expect(screen.getByText('Palestra')).toBeTruthy()
  expect(screen.getAllByText('Ano').length).toBeGreaterThan(0)
  expect(screen.getAllByRole('link')).toHaveLength(2)
  expect(screen.getByRole('button', { name: 'Lista' })).toBeTruthy()

  fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }))

  expect(
    screen.getByRole('heading', {
      level: 1,
      name: 'Talks, workshops, and gatherings.',
    }),
  ).toBeTruthy()
  expect(screen.getByText('Talk')).toBeTruthy()
  expect(screen.getAllByText('Year').length).toBeGreaterThan(0)
  expect(screen.getAllByRole('link')).toHaveLength(2)
  expect(screen.getByRole('button', { name: 'List' })).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Grid' })).toBeTruthy()
  expect(screen.queryByText('Palestra')).toBeNull()
  expect(document.querySelector('time')?.textContent).toBe('23 Sep. 2026')
})
