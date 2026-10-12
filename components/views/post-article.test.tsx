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
  }: {
    children: ReactNode
    href: string
    className?: string
  }) {
    return (
      <a href={href} className={className}>
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
