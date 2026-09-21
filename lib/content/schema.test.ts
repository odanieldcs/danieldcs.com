import { expect, test } from 'vitest'
import { z } from 'zod'
import { postFrontmatterSchema } from './schema'

const validFrontmatter = {
  title: 'Building with Next.js',
  description: 'Notes on the App Router.',
  date: '2026-09-21',
  updatedAt: '2026-09-22',
  tags: ['nextjs', 'typescript'],
  cover: '/media/posts/building-with-nextjs.jpg',
  language: 'pt',
}

function issuePaths(error: z.ZodError): Array<PropertyKey> {
  return error.issues.flatMap((issue) => issue.path)
}

test('parses a complete valid frontmatter and coerces dates', () => {
  const result = postFrontmatterSchema.parse(validFrontmatter)

  expect(result.title).toBe(validFrontmatter.title)
  expect(result.description).toBe(validFrontmatter.description)
  expect(result.date).toBeInstanceOf(Date)
  expect(result.updatedAt).toBeInstanceOf(Date)
  expect(result.tags).toEqual(['nextjs', 'typescript'])
  expect(result.cover).toBe(validFrontmatter.cover)
  expect(result.language).toBe('pt')
})

test('defaults omitted tags to an empty array', () => {
  const withoutTags = {
    title: validFrontmatter.title,
    description: validFrontmatter.description,
    date: validFrontmatter.date,
    updatedAt: validFrontmatter.updatedAt,
    cover: validFrontmatter.cover,
    language: validFrontmatter.language,
  }

  expect(postFrontmatterSchema.parse(withoutTags).tags).toEqual([])
})

test.each(['title', 'description', 'date', 'language'] as const)(
  'fails when %s is missing with an identifiable path',
  (field) => {
    const { [field]: _omitted, ...rest } = validFrontmatter
    const result = postFrontmatterSchema.safeParse(rest)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeInstanceOf(z.ZodError)
      expect(issuePaths(result.error)).toContain(field)
    }
  },
)

test('fails when language is outside the enum', () => {
  const result = postFrontmatterSchema.safeParse({
    ...validFrontmatter,
    language: 'es',
  })

  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.error).toBeInstanceOf(z.ZodError)
    expect(issuePaths(result.error)).toContain('language')
  }
})

test.each(['draft', 'titel'])(
  'fails when an extra key %s is present',
  (extraKey) => {
    const result = postFrontmatterSchema.safeParse({
      ...validFrontmatter,
      [extraKey]: true,
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeInstanceOf(z.ZodError)
    }
  },
)

test('fails when title is empty', () => {
  const result = postFrontmatterSchema.safeParse({
    ...validFrontmatter,
    title: '',
  })

  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.error).toBeInstanceOf(z.ZodError)
    expect(issuePaths(result.error)).toContain('title')
  }
})

test('fails when a tag is empty', () => {
  const result = postFrontmatterSchema.safeParse({
    ...validFrontmatter,
    tags: [''],
  })

  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.error).toBeInstanceOf(z.ZodError)
    expect(issuePaths(result.error)).toContain('tags')
  }
})
