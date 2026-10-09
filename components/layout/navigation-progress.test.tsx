import { expect, test } from 'vitest'
import { isInternalPageNavigation } from './navigation-progress'

const here = 'http://localhost:3000/blog'

test('tracks another internal page and a new search', () => {
  expect(isInternalPageNavigation('/about', here)).toBe(true)
  expect(isInternalPageNavigation('/blog?page=2', here)).toBe(true)
  expect(
    isInternalPageNavigation(
      'http://localhost:3000/en/community',
      'http://localhost:3000/en',
    ),
  ).toBe(true)
})

test('ignores the current url, hash-only jumps, and other sites', () => {
  expect(isInternalPageNavigation('/blog', here)).toBe(false)
  expect(isInternalPageNavigation('/blog#logs', here)).toBe(false)
  expect(isInternalPageNavigation('https://linkedin.com', here)).toBe(false)
})
