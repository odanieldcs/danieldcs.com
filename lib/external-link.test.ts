import { expect, test } from 'vitest'
import { externalHrefHost, isExternalHref } from './external-link'

const siteHost = 'danieldcs.com'

test('isExternalHref is false for relative, anchor, mailto, tel, and invalid URLs', () => {
  expect(isExternalHref('/blog', siteHost)).toBe(false)
  expect(isExternalHref('#section', siteHost)).toBe(false)
  expect(isExternalHref('mailto:hi@danieldcs.com', siteHost)).toBe(false)
  expect(isExternalHref('tel:+5551999999999', siteHost)).toBe(false)
  expect(isExternalHref('not a url', siteHost)).toBe(false)
})

test('isExternalHref is false for same host over http(s)', () => {
  expect(isExternalHref('https://danieldcs.com/blog?x=1', siteHost)).toBe(false)
  expect(isExternalHref('http://danieldcs.com/about', siteHost)).toBe(false)
})

test('isExternalHref is true for other http(s) hosts', () => {
  expect(isExternalHref('https://github.com/foo?x=1', siteHost)).toBe(true)
  expect(isExternalHref('https://www.linkedin.com/in/user', siteHost)).toBe(
    true,
  )
})

test('externalHrefHost returns hostname only for outbound http(s) links', () => {
  expect(externalHrefHost('https://github.com/foo?x=1', siteHost)).toBe(
    'github.com',
  )
  expect(externalHrefHost('/blog', siteHost)).toBeNull()
  expect(externalHrefHost('https://danieldcs.com/blog', siteHost)).toBeNull()
})
