import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, expect, test, vi } from 'vitest'
import type { Post } from '@/lib/content/posts'
import { PostArticle } from './post-article'

vi.mock('next/image', () => ({
  default: function MockImage({ alt, src }: { alt: string; src: string }) {
    return <img alt={alt} src={src} />
  },
}))

vi.mock('@/lib/content/mdx', () => ({
  MdxContent: ({ source }: { source: string }) => <div>{source}</div>,
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

const post: Post = {
  slug: 'hello-world',
  content: 'Body',
  frontmatter: {
    title: 'Hello World',
    description: 'A post',
    date: new Date('2026-09-21T00:00:00.000Z'),
    tags: [],
    cover: 'hello-world.png',
    language: 'pt',
  },
}

afterEach(() => {
  cleanup()
})

test('wraps the article frame in main and keeps the top button outside the frame', () => {
  const { container } = render(<PostArticle post={post} language="pt" />)

  const main = screen.getByRole('main')
  const frame = container.querySelector('.article-frame')
  const article = container.querySelector('article')
  expect(frame).toBeTruthy()
  expect(main.contains(frame)).toBe(true)
  expect(frame?.contains(article)).toBe(true)
  expect(article?.getAttribute('data-analytics-source')).toBe('post')

  const backToTop = screen.getByRole('button', { name: 'Voltar ao topo' })
  expect(main.contains(backToTop)).toBe(true)
  expect(frame?.contains(backToTop)).toBe(false)
  expect(container.querySelector('img')?.getAttribute('alt')).toBe('')
})

function renderArticle(
  language: 'pt' | 'en',
  contentLanguage: 'pt' | 'en' = 'pt',
) {
  return render(
    <PostArticle
      post={{
        ...post,
        frontmatter: { ...post.frontmatter, language: contentLanguage },
      }}
      language={language}
    />,
  )
}

test('marks the title and body when a Portuguese post is read in English', () => {
  const { container } = renderArticle('en')

  expect(screen.getByRole('heading', { level: 1 }).getAttribute('lang')).toBe(
    'pt-BR',
  )
  expect(screen.getByText('Body').parentElement?.getAttribute('lang')).toBe(
    'pt-BR',
  )
  expect(container.querySelector('article')?.hasAttribute('lang')).toBe(false)
  expect(container.querySelector('img')?.hasAttribute('lang')).toBe(false)

  const published = screen.getByRole('time')
  expect(published.hasAttribute('lang')).toBe(false)
  expect(published.textContent).toBe('Sep 21, 2026')
  expect(screen.getByRole('note').hasAttribute('lang')).toBe(false)
  expect(
    screen
      .getByRole('link', { name: 'Read in Portuguese' })
      .hasAttribute('lang'),
  ).toBe(false)
  expect(
    screen.getByRole('link', { name: 'Back to Blog' }).hasAttribute('lang'),
  ).toBe(false)
})

test('omits lang when a Portuguese post is read in Portuguese', () => {
  const { container } = renderArticle('pt')

  expect(container.querySelector('[lang]')).toBeNull()
  expect(screen.getByRole('time').textContent).toBe('21 set. 2026')
  expect(screen.queryByRole('note')).toBeNull()
  expect(
    screen
      .getByRole('link', { name: 'Voltar para o blog' })
      .hasAttribute('lang'),
  ).toBe(false)
})

test('marks the title and body when an English post is read in Portuguese', () => {
  renderArticle('pt', 'en')

  expect(screen.getByRole('heading', { level: 1 }).getAttribute('lang')).toBe(
    'en',
  )
  expect(screen.getByText('Body').parentElement?.getAttribute('lang')).toBe(
    'en',
  )
  expect(screen.getByRole('time').hasAttribute('lang')).toBe(false)
  expect(screen.getByRole('time').textContent).toBe('21 set. 2026')
  expect(screen.getByRole('note').hasAttribute('lang')).toBe(false)
  expect(
    screen
      .getByRole('link', { name: 'Voltar para o blog' })
      .hasAttribute('lang'),
  ).toBe(false)
})
