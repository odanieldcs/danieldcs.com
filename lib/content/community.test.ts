import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, expect, test } from 'vitest'
import { getAllCommunityEntries, getAllCommunityEntrySlugs } from './community'

const isolatedDirs: string[] = []

afterEach(() => {
  for (const dir of isolatedDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true })
  }
})

function isolatedCommunityDir(): string {
  const dir = mkdtempSync(path.join(tmpdir(), 'community-'))
  isolatedDirs.push(dir)
  return dir
}

function writeEntry(
  dir: string,
  slug: string,
  frontmatter: string,
  body = '\n',
) {
  writeFileSync(
    path.join(dir, `${slug}.mdx`),
    `---\n${frontmatter}\n---\n${body}`,
  )
}

test('loads content/community newest first and ignores README.md', () => {
  const slugs = getAllCommunityEntrySlugs()
  expect(slugs).toContain('exemplo-2026-09-palestra')
  expect(slugs).not.toContain('README')

  const entries = getAllCommunityEntries()
  expect(entries).toHaveLength(23)
  expect(entries.map((entry) => entry.slug)[0]).toBe('exemplo-2026-09-palestra')
  expect(entries.at(-1)?.slug).toBe('exemplo-2023-01-palestra')
  expect(entries[0]).not.toHaveProperty('content')

  const times = entries.map((entry) => entry.frontmatter.date.getTime())
  expect(times).toEqual([...times].sort((a, b) => b - a))

  const years = entries.map((entry) => entry.frontmatter.date.getUTCFullYear())
  expect(new Set(years)).toEqual(new Set([2026, 2025, 2024, 2023]))
  expect(
    entries.every(
      (entry) =>
        entry.frontmatter.date.getTime() <=
        Date.parse('2026-09-23T00:00:00.000Z'),
    ),
  ).toBe(true)
  expect(entries.some((entry) => entry.frontmatter.link)).toBe(true)
  expect(entries.some((entry) => entry.frontmatter.link === undefined)).toBe(
    true,
  )
  expect(entries.some((entry) => entry.frontmatter.eventName)).toBe(true)
  expect(
    entries.some((entry) => entry.frontmatter.eventName === undefined),
  ).toBe(true)
  expect(entries.every((entry) => entry.frontmatter.cover === undefined)).toBe(
    true,
  )
})

test('throws an identifiable error for invalid frontmatter in an isolated directory', () => {
  const dir = isolatedCommunityDir()
  writeEntry(
    dir,
    'broken',
    [
      'title: ""',
      'description: Missing a real title.',
      'date: 2026-09-21',
      'type: talk',
      'language: pt',
    ].join('\n'),
  )

  expect(() => getAllCommunityEntries(dir)).toThrow(
    /Invalid frontmatter in broken\.mdx: title/,
  )
})

test('orders entries by date descending and ignores README.md', () => {
  const dir = isolatedCommunityDir()
  writeEntry(
    dir,
    'older',
    [
      'title: Older',
      'description: First.',
      'date: 2023-03-11',
      'type: event',
      'language: pt',
    ].join('\n'),
  )
  writeEntry(
    dir,
    'newer',
    [
      'title: Newer',
      'description: Second.',
      'date: 2026-09-23',
      'type: talk',
      'language: en',
    ].join('\n'),
  )
  writeFileSync(path.join(dir, 'README.md'), '# Ignore me\n')

  expect(getAllCommunityEntrySlugs(dir).sort()).toEqual(['newer', 'older'])
  expect(getAllCommunityEntries(dir).map((entry) => entry.slug)).toEqual([
    'newer',
    'older',
  ])
  expect(getAllCommunityEntries(dir)[0]).not.toHaveProperty('content')
})
