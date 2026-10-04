import { expect, test } from 'vitest'
import { getAllPosts, type PostSummary } from '@/lib/content/posts'
import { getAlternates, localizedPages } from '@/lib/i18n/alternates'
import { absoluteSiteUrl } from '@/lib/site'
import { buildSitemap } from './sitemap'

test('includes every indexable localized page in PT and EN with hreflang', () => {
  const sitemap = buildSitemap([])
  const urls = new Set(sitemap.map((entry) => entry.url))

  for (const page of localizedPages) {
    if (!page.indexable) {
      continue
    }

    for (const pathname of [page.pt, page.en]) {
      expect(urls).toContain(absoluteSiteUrl(pathname))

      const entry = sitemap.find((item) => item.url === absoluteSiteUrl(pathname))
      const languages = getAlternates(pathname).languages

      expect(entry?.alternates?.languages).toEqual(
        languages
          ? Object.fromEntries(
              Object.entries(languages).flatMap(([locale, href]) =>
                typeof href === 'string'
                  ? [[locale, absoluteSiteUrl(href)]]
                  : [],
              ),
            )
          : undefined,
      )
      expect(entry?.lastModified).toBeUndefined()
    }
  }
})

test('includes PT blog posts with lastModified and excludes EN post URLs', () => {
  const posts = getAllPosts()
  const sitemap = buildSitemap(posts)
  const urls = sitemap.map((entry) => entry.url)

  expect(posts.length).toBeGreaterThan(0)

  for (const post of posts) {
    expect(urls).toContain(absoluteSiteUrl(`/blog/${post.slug}`))
    expect(urls).not.toContain(absoluteSiteUrl(`/en/blog/${post.slug}`))

    const entry = sitemap.find(
      (item) => item.url === absoluteSiteUrl(`/blog/${post.slug}`),
    )
    expect(entry?.lastModified).toEqual(
      post.frontmatter.updatedAt ?? post.frontmatter.date,
    )
    expect(entry?.alternates).toBeUndefined()
  }
})

test('omits noindex routes, pagination, and unpaired paths', () => {
  const sitemap = buildSitemap(getAllPosts())
  const urls = sitemap.map((entry) => entry.url)

  for (const pathname of [
    '/trilha',
    '/en/trilha',
    '/design-system',
    '/alunos',
    '/blog?page=2',
    '/en/blog?view=grid',
  ]) {
    expect(urls).not.toContain(absoluteSiteUrl(pathname))
  }
})

test('post lastModified prefers updatedAt over date', () => {
  const updatedAt = new Date('2025-06-01T12:00:00.000Z')
  const date = new Date('2024-01-01T00:00:00.000Z')
  const post: PostSummary = {
    slug: 'fixture-post',
    frontmatter: {
      title: 'Fixture',
      description: 'Fixture post',
      date,
      updatedAt,
      tags: [],
      language: 'pt',
    },
  }

  const [entry] = buildSitemap([post]).filter((item) =>
    item.url.endsWith('/blog/fixture-post'),
  )

  expect(entry?.lastModified).toBe(updatedAt)
})
