import { expect, test } from 'vitest'
import { equivalentPath, localizePath } from './routes'

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

test('maps a PT page to the same page under /en', () => {
  expect(equivalentPath('/', 'en')).toBe('/en')
  expect(equivalentPath('/about', 'en')).toBe('/en/about')
  expect(equivalentPath('/blog', 'en')).toBe('/en/blog')
  expect(equivalentPath('/community', 'en')).toBe('/en/community')
  expect(equivalentPath('/trilha', 'en')).toBe('/en/trilha')
})

test('maps an EN page back to the same PT page', () => {
  expect(equivalentPath('/en', 'pt')).toBe('/')
  expect(equivalentPath('/en/about', 'pt')).toBe('/about')
  expect(equivalentPath('/en/blog', 'pt')).toBe('/blog')
  expect(equivalentPath('/en/trilha', 'pt')).toBe('/trilha')
})

test('maps a post to the same post in the other language', () => {
  expect(equivalentPath('/blog/hello-world', 'en')).toBe('/en/blog/hello-world')
  expect(equivalentPath('/en/blog/hello-world', 'pt')).toBe('/blog/hello-world')
})

test('maps PT-only pages to the EN home', () => {
  expect(equivalentPath('/design-system', 'en')).toBe('/en')
  expect(equivalentPath('/qualquer', 'en')).toBe('/en')
  expect(equivalentPath('/en/qualquer', 'en')).toBe('/en')
})

test('does not treat paths that only start with "en" as EN routes', () => {
  expect(equivalentPath('/entrevistas', 'pt')).toBe('/entrevistas')
})
