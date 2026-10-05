import { expect, test } from 'vitest'
import { buildFeedXml } from '@/app/(pt)/feed/route'
import { getAllPosts } from '@/lib/content/posts'
import { defaultDescription } from '@/lib/metadata'
import { getPostCanonicalPath } from '@/lib/seo/post-canonical'
import { absoluteSiteUrl, personName, siteUrl } from '@/lib/site'
import { buildRssFeed, type RssChannel, type RssItem } from './rss'

function postUrl(slug: string): string {
  const canonical = getPostCanonicalPath(slug)
  if (typeof canonical !== 'string') {
    throw new Error(`Missing canonical for /blog/${slug}`)
  }
  return absoluteSiteUrl(canonical)
}

const publishedAt = new Date('2024-06-01T12:00:00.000Z')
const older = new Date('2020-01-02T03:04:05.000Z')

const channel: RssChannel = {
  title: 'Canal',
  link: siteUrl,
  description: 'Descrição do canal',
  language: 'pt-BR',
  lastBuildDate: publishedAt,
  selfLink: absoluteSiteUrl('/feed'),
}

function item(overrides: Partial<RssItem> = {}): RssItem {
  return {
    title: 'Título',
    link: absoluteSiteUrl('/blog/exemplo'),
    guid: absoluteSiteUrl('/blog/exemplo'),
    description: 'Resumo',
    pubDate: publishedAt,
    categories: ['nodejs'],
    ...overrides,
  }
}

test('escapes &, <, >, " and \' in text', () => {
  const xml = buildRssFeed(channel, [
    item({ title: `Tom & Jerry <tag> "quoted" 'apos'` }),
  ])

  expect(xml).toContain(
    '<title>Tom &amp; Jerry &lt;tag&gt; &quot;quoted&quot; &apos;apos&apos;</title>',
  )
  expect(xml).not.toContain('Tom & Jerry')
})

test('emits items in the given order, newest first for published posts', () => {
  const xml = buildRssFeed(channel, [
    item({
      title: 'Novo',
      link: absoluteSiteUrl('/blog/novo'),
      guid: absoluteSiteUrl('/blog/novo'),
      pubDate: publishedAt,
    }),
    item({
      title: 'Antigo',
      link: absoluteSiteUrl('/blog/antigo'),
      guid: absoluteSiteUrl('/blog/antigo'),
      pubDate: older,
    }),
  ])

  expect(xml.indexOf('<title>Novo</title>')).toBeLessThan(
    xml.indexOf('<title>Antigo</title>'),
  )

  const posts = getAllPosts()
  const feed = buildFeedXml(posts)
  let previous = -1

  for (const post of posts) {
    const index = feed.indexOf(
      `<guid isPermaLink="true">${postUrl(post.slug)}</guid>`,
    )
    expect(index).toBeGreaterThan(previous)
    previous = index
  }
})

test('formats pubDate and lastBuildDate with Date.toUTCString and stays stable', () => {
  const posts = getAllPosts()
  const first = buildFeedXml(posts)
  const second = buildFeedXml(posts)

  const newest = posts[0]
  if (!newest) {
    throw new Error('expected at least one post')
  }

  expect(second).toBe(first)
  expect(first).toContain(
    `<lastBuildDate>${newest.frontmatter.date.toUTCString()}</lastBuildDate>`,
  )

  for (const post of posts) {
    expect(first).toContain(
      `<pubDate>${post.frontmatter.date.toUTCString()}</pubDate>`,
    )
  }

  const synthetic = buildRssFeed(channel, [item({ pubDate: older })])
  expect(synthetic).toContain(
    `<lastBuildDate>${publishedAt.toUTCString()}</lastBuildDate>`,
  )
  expect(synthetic).toContain(`<pubDate>${older.toUTCString()}</pubDate>`)
  expect(buildRssFeed(channel, [item({ pubDate: older })])).toBe(synthetic)
})

test('omits category when a post has no tags', () => {
  const xml = buildRssFeed(channel, [item({ categories: [] })])

  expect(xml).not.toContain('<category>')
  expect(xml).toContain('<item>')
})

test('includes every published post with guid and link equal to the canonical URL', () => {
  const posts = getAllPosts()
  const xml = buildFeedXml()

  expect(xml.match(/<item>/g)).toHaveLength(posts.length)
  expect(xml).toContain(`<title>${personName}</title>`)
  expect(xml).toContain(`<link>${siteUrl}</link>`)
  expect(xml).toContain(`<description>${defaultDescription}</description>`)
  expect(xml).toContain('<language>pt-BR</language>')
  expect(xml).toContain(
    `<atom:link href="${absoluteSiteUrl('/feed')}" rel="self" type="application/rss+xml"/>`,
  )

  for (const post of posts) {
    const url = postUrl(post.slug)
    expect(xml).toContain(`<link>${url}</link>`)
    expect(xml).toContain(`<guid isPermaLink="true">${url}</guid>`)

    for (const tag of post.frontmatter.tags) {
      expect(xml).toContain(`<category>${tag}</category>`)
    }
  }
})
