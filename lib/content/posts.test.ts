import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, expect, test } from 'vitest'
import { getAllPostSlugs, getAllPosts, getPostBySlug } from './posts'

const isolatedDirs: string[] = []

afterEach(() => {
  for (const dir of isolatedDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true })
  }
})

function isolatedPostsDir(): string {
  const dir = mkdtempSync(path.join(tmpdir(), 'posts-'))
  isolatedDirs.push(dir)
  return dir
}

function writePost(
  dir: string,
  slug: string,
  frontmatter: string,
  body = 'Body.\n',
) {
  writeFileSync(
    path.join(dir, `${slug}.mdx`),
    `---\n${frontmatter}\n---\n\n${body}`,
  )
}

test('reads the hello-world fixture from content/posts', () => {
  const slugs = getAllPostSlugs()
  expect(slugs).toContain('hello-world')

  const post = getPostBySlug('hello-world')

  expect(post.slug).toBe('hello-world')
  expect(post.frontmatter.title).toBe('Hello World')
  expect(post.frontmatter.description).toBe(
    'Fixture post for the content system loaders.',
  )
  expect(post.frontmatter.date).toBeInstanceOf(Date)
  expect(post.frontmatter.tags).toEqual(['hello'])
  expect(post.frontmatter.cover).toBe('hello-world.png')
  expect(post.frontmatter.language).toBe('pt')
  expect(post.content).toContain('exercise the content loaders')
  expect(post.content).not.toContain('# ')

  const summaries = getAllPosts()
  const hello = summaries.find((entry) => entry.slug === 'hello-world')
  expect(hello?.frontmatter.title).toBe('Hello World')
  expect(hello).not.toHaveProperty('content')
})

test('throws an identifiable error for invalid frontmatter in an isolated directory', () => {
  const dir = isolatedPostsDir()
  writePost(
    dir,
    'broken',
    [
      'title: ""',
      'description: Missing a real title.',
      'date: 2026-09-21',
      'language: pt',
    ].join('\n'),
  )

  expect(() => getPostBySlug('broken', dir)).toThrow(
    /Invalid frontmatter in broken\.mdx: title/,
  )
})

test('throws when the slug does not exist', () => {
  expect(() => getPostBySlug('slug-inexistente')).toThrow(
    'Post not found: slug-inexistente',
  )
})

test('orders getAllPosts by date descending and ignores README.md', () => {
  const dir = isolatedPostsDir()
  writePost(
    dir,
    'older',
    [
      'title: Older',
      'description: First.',
      'date: 2026-01-01',
      'language: pt',
    ].join('\n'),
  )
  writePost(
    dir,
    'newer',
    [
      'title: Newer',
      'description: Second.',
      'date: 2026-09-21',
      'language: en',
    ].join('\n'),
  )
  writeFileSync(path.join(dir, 'README.md'), '# Ignore me\n')

  expect(getAllPostSlugs(dir).sort()).toEqual(['newer', 'older'])
  expect(getAllPosts(dir).map((post) => post.slug)).toEqual(['newer', 'older'])
})
