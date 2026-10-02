import { expect, test } from 'vitest'
import { localizePath } from './routes'

test('keeps PT paths unprefixed', () => {
  expect(localizePath('/', 'pt')).toBe('/')
  expect(localizePath('/blog', 'pt')).toBe('/blog')
  expect(localizePath('/blog?page=2', 'pt')).toBe('/blog?page=2')
})

test('prefixes EN paths with /en', () => {
  expect(localizePath('/', 'en')).toBe('/en')
  expect(localizePath('/about', 'en')).toBe('/en/about')
  expect(localizePath('/blog?view=grid', 'en')).toBe('/en/blog?view=grid')
})
