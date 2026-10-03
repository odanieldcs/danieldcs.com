import { existsSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from 'vitest'
import { resolveCoverSrc } from './cover'
import { getAllPosts } from './posts'

test('keeps a site-absolute cover path unchanged', () => {
  expect(resolveCoverSrc('/media/posts/slug/capa.png')).toBe(
    '/media/posts/slug/capa.png',
  )
})

test('resolves a bare filename against the shared posts media folder', () => {
  expect(resolveCoverSrc('capa.png')).toBe('/media/posts/capa.png')
})

// Iterates every published post (no fixed count) so a new post (e.g. ENG-129)
// is covered automatically.
const coveredPosts = getAllPosts().flatMap((post) =>
  post.frontmatter.cover
    ? [{ slug: post.slug, cover: post.frontmatter.cover }]
    : [],
)

test('there is at least one published post with a cover to check', () => {
  expect(coveredPosts.length).toBeGreaterThan(0)
})

test.each(coveredPosts)(
  'cover for $slug resolves to a file in public/',
  ({ cover }) => {
    const resolved = resolveCoverSrc(cover)
    const filePath = path.join(process.cwd(), 'public', resolved)

    expect(existsSync(filePath)).toBe(true)
  },
)
