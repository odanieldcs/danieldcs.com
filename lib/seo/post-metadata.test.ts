import type { StaticImageData } from 'next/image'
import { expect, test } from 'vitest'
import { resolveCoverSrc } from '@/lib/content/cover'
import { getAllPosts, type PostSummary } from '@/lib/content/posts'
import { buildPostMetadata } from './post-metadata'

const fallbackImage: StaticImageData = {
  src: '/_next/static/media/opengraph-image.default.png',
  width: 1200,
  height: 630,
}

type ResolvedOpenGraph = {
  type?: string
  url?: string
  siteName?: string
  locale?: string
  title?: string
  description?: string
  publishedTime?: string
  modifiedTime?: string
  tags?: readonly string[]
  images?: ReadonlyArray<{ url: string; width?: number; height?: number }>
}

type ResolvedTwitter = {
  card?: string
  images?: ReadonlyArray<{ url: string }>
}

function makePost(
  frontmatter: Partial<PostSummary['frontmatter']> = {},
): PostSummary {
  return {
    slug: 'exemplo-post',
    frontmatter: {
      title: 'Título do post',
      description: 'Descrição do post',
      date: new Date('2024-02-03T00:00:00.000Z'),
      tags: ['nodejs', 'typescript'],
      language: 'pt',
      ...frontmatter,
    },
  }
}

function openGraphOf(post: PostSummary): ResolvedOpenGraph {
  return buildPostMetadata(post, fallbackImage).openGraph as ResolvedOpenGraph
}

test('builds article Open Graph with canonical url and frontmatter fields', () => {
  const metadata = buildPostMetadata(makePost(), fallbackImage)
  const openGraph = metadata.openGraph as ResolvedOpenGraph

  expect(metadata.title).toBe('Título do post')
  expect(metadata.description).toBe('Descrição do post')
  expect(metadata.alternates?.canonical).toBe('/blog/exemplo-post')
  expect(openGraph.type).toBe('article')
  expect(openGraph.url).toBe('/blog/exemplo-post')
  expect(openGraph.siteName).toBe('Daniel Castro')
  expect(openGraph.locale).toBe('pt_BR')
  expect(openGraph.publishedTime).toBe('2024-02-03T00:00:00.000Z')
  expect(openGraph.tags).toEqual(['nodejs', 'typescript'])
})

test('og:url always matches the canonical path', () => {
  const metadata = buildPostMetadata(makePost(), fallbackImage)
  const openGraph = metadata.openGraph as ResolvedOpenGraph

  expect(openGraph.url).toBe(metadata.alternates?.canonical)
})

test('og:locale comes from the content language, not the interface', () => {
  expect(openGraphOf(makePost({ language: 'en' })).locale).toBe('en_US')
})

test('a post with a cover uses the resolved cover for og and twitter images', () => {
  const cover = '/media/posts/exemplo-post/capa.png'
  const metadata = buildPostMetadata(makePost({ cover }), fallbackImage)
  const openGraph = metadata.openGraph as ResolvedOpenGraph
  const twitter = metadata.twitter as ResolvedTwitter

  expect(openGraph.images).toEqual([{ url: resolveCoverSrc(cover) }])
  expect(twitter.images).toEqual([{ url: resolveCoverSrc(cover) }])
})

test('a post without a cover falls back to the injected default image', () => {
  const metadata = buildPostMetadata(
    makePost({ cover: undefined }),
    fallbackImage,
  )
  const openGraph = metadata.openGraph as ResolvedOpenGraph
  const twitter = metadata.twitter as ResolvedTwitter

  const expected = { url: fallbackImage.src, width: 1200, height: 630 }
  expect(openGraph.images).toEqual([expected])
  expect(twitter.images).toEqual([expected])
})

test('includes modifiedTime only when updatedAt is present', () => {
  expect(openGraphOf(makePost()).modifiedTime).toBeUndefined()

  const updatedAt = new Date('2024-05-06T00:00:00.000Z')
  expect(openGraphOf(makePost({ updatedAt })).modifiedTime).toBe(
    '2024-05-06T00:00:00.000Z',
  )
})

test('twitter inherits the summary_large_image card from the base metadata', () => {
  const twitter = buildPostMetadata(makePost(), fallbackImage)
    .twitter as ResolvedTwitter

  expect(twitter.card).toBe('summary_large_image')
})

test('every published post builds valid metadata', () => {
  const posts = getAllPosts()
  expect(posts.length).toBeGreaterThan(0)

  for (const post of posts) {
    const metadata = buildPostMetadata(post, fallbackImage)
    const openGraph = metadata.openGraph as ResolvedOpenGraph

    expect(metadata.title).toBe(post.frontmatter.title)
    expect(metadata.alternates?.canonical).toBe(`/blog/${post.slug}`)
    expect(openGraph.type).toBe('article')
    expect(openGraph.images).toHaveLength(1)
    expect(openGraph.images?.[0]?.url).toBeTruthy()
  }
})
