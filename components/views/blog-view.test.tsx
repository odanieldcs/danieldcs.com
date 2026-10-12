import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { InterfaceLanguageProvider } from '@/components/interface-language-provider'
import { BLOG_PAGE_SIZE } from '@/lib/blog/pagination'
import { type BlogPostView, BlogView } from './blog-view'

const posts: BlogPostView[] = [
  {
    slug: 'content-system',
    title: 'Como o content system renderiza um artigo',
    description: 'Um passeio pelo pipeline de ponta a ponta.',
    date: '2026-09-21T00:00:00.000Z',
    language: 'pt',
    cover: 'content-system.png',
  },
  {
    slug: 'hello-world',
    title: 'Hello World',
    description: 'Fixture post for the content system loaders.',
    date: '2026-09-21T00:00:00.000Z',
    language: 'pt',
    cover: 'hello-world.png',
  },
  {
    slug: 'exemplo-typescript',
    title: 'TypeScript no dia a dia',
    description:
      'Pequenas decisões de tipagem que evitam surpresas em produção.',
    date: '2026-08-15T00:00:00.000Z',
    language: 'pt',
    cover: 'exemplo-typescript.png',
  },
]

const englishPost: BlogPostView = {
  slug: 'content-system',
  title: 'English title',
  description: 'A post written in English.',
  date: '2026-09-21T00:00:00.000Z',
  language: 'en',
}

afterEach(() => {
  cleanup()
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
    <InterfaceLanguageProvider language={language}>
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
    within(articleLink).queryByText(
      'Um passeio pelo pipeline de ponta a ponta.',
    ),
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

  expect(within(articleLink).getByRole('time').textContent).toBe('Sep 2026')
})

test('grid view hides descriptions and treats covers as decorative', () => {
  const { container } = renderBlog('pt', { view: 'grid' })

  expect(
    screen.queryByText('Um passeio pelo pipeline de ponta a ponta.'),
  ).toBeNull()
  const covers = container.querySelectorAll('img')
  expect(covers).toHaveLength(3)
  for (const cover of covers) {
    expect(cover.getAttribute('alt')).toBe('')
  }
  expect(
    screen.getByRole('link', {
      name: (accessibleName) =>
        accessibleName.split('Hello World').length - 1 === 1,
    }),
  ).toBeTruthy()
})

test('view switch links preserve the current page', () => {
  renderBlog('pt', { page: 2, pageCount: 3 })

  expect(screen.getByRole('link', { name: 'Grade' }).getAttribute('href')).toBe(
    '/blog?view=grid&page=2',
  )
  expect(screen.getByRole('link', { name: 'Lista' }).getAttribute('href')).toBe(
    '/blog?page=2',
  )
})

test('pagination is hidden with at most one page of items', () => {
  renderBlog('pt', { pageCount: 1 })

  expect(screen.queryByRole('navigation', { name: 'Paginação' })).toBeNull()
})

test('pagination links preserve view and mark the current page', () => {
  renderBlog('pt', { view: 'grid', page: 2, pageCount: 3 })

  const nav = screen.getByRole('navigation', { name: 'Paginação' })
  expect(
    within(nav).getByRole('link', { name: 'Anterior' }).getAttribute('href'),
  ).toBe('/blog?view=grid')
  expect(
    within(nav).getByRole('link', { name: 'Próxima' }).getAttribute('href'),
  ).toBe('/blog?view=grid&page=3')
  expect(
    within(nav).getByRole('link', { name: '2' }).getAttribute('aria-current'),
  ).toBe('page')
})

test('EN listing keeps view, pagination and posts under /en/blog', () => {
  renderBlog('en', { view: 'grid', page: 2, pageCount: 3 })

  expect(screen.getByRole('link', { name: 'List' }).getAttribute('href')).toBe(
    '/en/blog?page=2',
  )
  const nav = screen.getByRole('navigation', { name: 'Pagination' })
  expect(
    within(nav).getByRole('link', { name: 'Previous' }).getAttribute('href'),
  ).toBe('/en/blog?view=grid')
  expect(
    within(nav).getByRole('link', { name: 'Next' }).getAttribute('href'),
  ).toBe('/en/blog?view=grid&page=3')
  expect(
    screen
      .getByRole('link', { name: /Como o content system renderiza um artigo/i })
      .getAttribute('href'),
  ).toBe('/en/blog/content-system')
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

test('list view marks a Portuguese title when the interface is English', () => {
  renderBlog('en')

  const title = screen.getByRole('heading', {
    level: 2,
    name: 'Como o content system renderiza um artigo',
  })
  expect(title.getAttribute('lang')).toBe('pt-BR')

  const published = within(title.closest('a') as HTMLElement).getByRole('time')
  expect(published.hasAttribute('lang')).toBe(false)
  expect(published.textContent).toBe('Sep 2026')
})

test('grid view marks a Portuguese title when the interface is English', () => {
  renderBlog('en', { view: 'grid' })

  const title = screen.getByRole('heading', {
    level: 2,
    name: 'Como o content system renderiza um artigo',
  })
  expect(title.getAttribute('lang')).toBe('pt-BR')
  expect(
    within(title.closest('a') as HTMLElement)
      .getByRole('time')
      .hasAttribute('lang'),
  ).toBe(false)
})

test('omits lang when the post language matches the interface', () => {
  renderBlog('pt')

  for (const title of screen.getAllByRole('heading', { level: 2 })) {
    expect(title.hasAttribute('lang')).toBe(false)
  }

  cleanup()
  renderBlog('en', { posts: [englishPost] })
  expect(
    screen
      .getByRole('heading', { level: 2, name: 'English title' })
      .hasAttribute('lang'),
  ).toBe(false)
})

test('marks an English title when the interface is Portuguese', () => {
  renderBlog('pt', { posts: [englishPost] })

  expect(
    screen
      .getByRole('heading', { level: 2, name: 'English title' })
      .getAttribute('lang'),
  ).toBe('en')
  expect(screen.getByRole('time').hasAttribute('lang')).toBe(false)
})
