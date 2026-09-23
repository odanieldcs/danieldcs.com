import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import {
  InterfaceLanguageProvider,
} from '@/components/interface-language-provider'
import { BLOG_PAGE_SIZE } from '@/lib/blog/pagination'
import { INTERFACE_LANGUAGE_COOKIE_NAME } from '@/lib/i18n/types'
import { type BlogPostView, BlogView } from './blog-view'

const posts: BlogPostView[] = [
  {
    slug: 'content-system',
    title: 'Como o content system renderiza um artigo',
    description: 'Um passeio pelo pipeline de ponta a ponta.',
    date: '2026-09-21T00:00:00.000Z',
    cover: 'content-system.png',
  },
  {
    slug: 'hello-world',
    title: 'Hello World',
    description: 'Fixture post for the content system loaders.',
    date: '2026-09-21T00:00:00.000Z',
    cover: 'hello-world.png',
  },
  {
    slug: 'exemplo-typescript',
    title: 'TypeScript no dia a dia',
    description: 'Pequenas decisões de tipagem que evitam surpresas em produção.',
    date: '2026-08-15T00:00:00.000Z',
    cover: 'exemplo-typescript.png',
  },
]

afterEach(() => {
  cleanup()
  // biome-ignore lint/suspicious/noDocumentCookie: test cleanup of the jsdom cookie jar
  document.cookie = `${INTERFACE_LANGUAGE_COOKIE_NAME}=; Path=/; Max-Age=0`
  document.documentElement.lang = ''
})

function renderBlog(
  language: 'pt' | 'en' = 'pt',
  props: {
    posts?: BlogPostView[]
    view?: 'list' | 'grid'
    page?: number
    pageCount?: number
  } = {},
) {
  const {
    posts: nextPosts = posts,
    view = 'list',
    page = 1,
    pageCount = 1,
  } = props

  return render(
    <InterfaceLanguageProvider initialLanguage={language}>
      <BlogView
        posts={nextPosts}
        view={view}
        page={page}
        pageCount={pageCount}
      />
    </InterfaceLanguageProvider>,
  )
}

test('list view links to posts with title and month-year on the right', () => {
  renderBlog()

  const articleLink = screen.getByRole('link', {
    name: /Como o content system renderiza um artigo/i,
  })

  expect(articleLink.getAttribute('href')).toBe('/blog/content-system')
  expect(
    within(articleLink).queryByText('Um passeio pelo pipeline de ponta a ponta.'),
  ).toBeNull()
  const published = within(articleLink).getByRole('time')
  expect(published.textContent).toBe('set. 2026')
  expect(published.getAttribute('dateTime')).toBe('2026-09-21T00:00:00.000Z')
})

test('list view formats month and year in English', () => {
  renderBlog('en')

  const articleLink = screen.getByRole('link', {
    name: /Como o content system renderiza um artigo/i,
  })

  expect(within(articleLink).getByRole('time').textContent).toMatch(/Sep\.? 2026/)
})

test('grid view hides descriptions and shows cover images', () => {
  renderBlog('pt', { view: 'grid' })

  expect(
    screen.queryByText('Um passeio pelo pipeline de ponta a ponta.'),
  ).toBeNull()
  expect(screen.getAllByRole('img')).toHaveLength(3)
  expect(screen.getByRole('img', { name: 'Hello World' })).toBeTruthy()
})

test('view switch links preserve the current page', () => {
  renderBlog('pt', { page: 2, pageCount: 3 })

  expect(
    screen.getByRole('link', { name: 'Grade' }).getAttribute('href'),
  ).toBe('/blog?view=grid&page=2')
  expect(
    screen.getByRole('link', { name: 'Lista' }).getAttribute('href'),
  ).toBe('/blog?page=2')
})

test('pagination is hidden with at most one page of items', () => {
  renderBlog('pt', { pageCount: 1 })

  expect(screen.queryByRole('navigation', { name: 'Paginação' })).toBeNull()
})

test('pagination links preserve view and mark the current page', () => {
  renderBlog('pt', { view: 'grid', page: 2, pageCount: 3 })

  const nav = screen.getByRole('navigation', { name: 'Paginação' })
  expect(within(nav).getByRole('link', { name: 'Anterior' }).getAttribute('href')).toBe(
    '/blog?view=grid',
  )
  expect(within(nav).getByRole('link', { name: 'Próxima' }).getAttribute('href')).toBe(
    '/blog?view=grid&page=3',
  )
  expect(within(nav).getByRole('link', { name: '2' }).getAttribute('aria-current')).toBe(
    'page',
  )
})

test('empty state hides the view switch and pagination', () => {
  renderBlog('pt', { posts: [], pageCount: 0 })

  expect(screen.getByText('Nenhum artigo publicado ainda.')).toBeTruthy()
  expect(screen.queryByRole('group', { name: 'Formato' })).toBeNull()
  expect(screen.queryByRole('navigation')).toBeNull()
})

test('page size constant matches the listing contract', () => {
  expect(BLOG_PAGE_SIZE).toBe(12)
})
