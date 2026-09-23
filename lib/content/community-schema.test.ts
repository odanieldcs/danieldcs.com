import { expect, test } from 'vitest'
import { z } from 'zod'
import { communityFrontmatterSchema } from './community-schema'

const validFrontmatter = {
  title: 'Exemplo de palestra',
  description: 'Entrada de exemplo para exercitar a timeline.',
  date: '2026-09-23',
  type: 'talk',
  language: 'pt',
  eventName: 'Encontro de exemplo',
  link: 'https://example.com/community/exemplo',
  cover: 'foto.jpg',
}

function issuePaths(error: z.ZodError): Array<PropertyKey> {
  return error.issues.flatMap((issue) => issue.path)
}

test('parses a complete valid frontmatter and coerces the date', () => {
  const result = communityFrontmatterSchema.parse(validFrontmatter)

  expect(result.title).toBe(validFrontmatter.title)
  expect(result.description).toBe(validFrontmatter.description)
  expect(result.date).toBeInstanceOf(Date)
  expect(result.type).toBe('talk')
  expect(result.language).toBe('pt')
  expect(result.eventName).toBe(validFrontmatter.eventName)
  expect(result.link).toBe(validFrontmatter.link)
  expect(result.cover).toBe(validFrontmatter.cover)
})

test('accepts frontmatter without optional fields', () => {
  const result = communityFrontmatterSchema.parse({
    title: validFrontmatter.title,
    description: validFrontmatter.description,
    date: validFrontmatter.date,
    type: 'workshop',
    language: 'en',
  })

  expect(result.eventName).toBeUndefined()
  expect(result.link).toBeUndefined()
  expect(result.cover).toBeUndefined()
})

test.each(['title', 'description', 'date', 'type', 'language'] as const)(
  'fails when %s is missing with an identifiable path',
  (field) => {
    const { [field]: _omitted, ...rest } = validFrontmatter
    const result = communityFrontmatterSchema.safeParse(rest)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeInstanceOf(z.ZodError)
      expect(issuePaths(result.error)).toContain(field)
    }
  },
)

test.each([
  ['type', 'meetup'],
  ['language', 'es'],
] as const)('fails when %s is outside the enum', (field, value) => {
  const result = communityFrontmatterSchema.safeParse({
    ...validFrontmatter,
    [field]: value,
  })

  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.error).toBeInstanceOf(z.ZodError)
    expect(issuePaths(result.error)).toContain(field)
  }
})

test.each(['draft', 'titel'])(
  'fails when an extra key %s is present',
  (extraKey) => {
    const result = communityFrontmatterSchema.safeParse({
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
  const result = communityFrontmatterSchema.safeParse({
    ...validFrontmatter,
    title: '',
  })

  expect(result.success).toBe(false)
  if (!result.success) {
    expect(issuePaths(result.error)).toContain('title')
  }
})

test.each(['/relative', 'example.com', 'javascript:alert(1)'])(
  'fails when link is not an absolute http URL (%s)',
  (link) => {
    const result = communityFrontmatterSchema.safeParse({
      ...validFrontmatter,
      link,
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(issuePaths(result.error)).toContain('link')
    }
  },
)

test('fails when cover is a path instead of a filename', () => {
  const result = communityFrontmatterSchema.safeParse({
    ...validFrontmatter,
    cover: 'personal/foto.jpg',
  })

  expect(result.success).toBe(false)
  if (!result.success) {
    expect(issuePaths(result.error)).toContain('cover')
  }
})
