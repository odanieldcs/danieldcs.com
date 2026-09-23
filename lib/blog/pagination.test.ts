import { expect, test } from 'vitest'
import {
  BLOG_PAGE_SIZE,
  buildBlogListingHref,
  getBlogPageCount,
  normalizeBlogPage,
  parseBlogPage,
  parseBlogView,
  sliceBlogPage,
} from './pagination'

test('parseBlogView defaults to list and accepts grid', () => {
  expect(parseBlogView(undefined)).toBe('list')
  expect(parseBlogView('list')).toBe('list')
  expect(parseBlogView('grid')).toBe('grid')
  expect(parseBlogView('table')).toBe('list')
  expect(parseBlogView(['grid', 'list'])).toBe('grid')
})

test('parseBlogPage defaults invalid values to page 1', () => {
  expect(parseBlogPage(undefined)).toBe(1)
  expect(parseBlogPage('')).toBe(1)
  expect(parseBlogPage('0')).toBe(1)
  expect(parseBlogPage('-2')).toBe(1)
  expect(parseBlogPage('abc')).toBe(1)
  expect(parseBlogPage('2')).toBe(2)
})

test('getBlogPageCount and sliceBlogPage use a page size of 12', () => {
  expect(BLOG_PAGE_SIZE).toBe(12)
  expect(getBlogPageCount(0)).toBe(0)
  expect(getBlogPageCount(12)).toBe(1)
  expect(getBlogPageCount(13)).toBe(2)
  expect(getBlogPageCount(14)).toBe(2)

  const items = Array.from({ length: 14 }, (_, index) => index + 1)
  expect(sliceBlogPage(items, 1)).toEqual(items.slice(0, 12))
  expect(sliceBlogPage(items, 2)).toEqual([13, 14])
})

test('normalizeBlogPage clamps to the valid range', () => {
  expect(normalizeBlogPage(0, 3)).toBe(1)
  expect(normalizeBlogPage(99, 3)).toBe(3)
  expect(normalizeBlogPage(2, 3)).toBe(2)
  expect(normalizeBlogPage(2, 0)).toBe(1)
})

test('buildBlogListingHref omits default query values', () => {
  expect(buildBlogListingHref({})).toBe('/blog')
  expect(buildBlogListingHref({ page: 1 })).toBe('/blog')
  expect(buildBlogListingHref({ view: 'list' })).toBe('/blog')
  expect(buildBlogListingHref({ page: 2 })).toBe('/blog?page=2')
  expect(buildBlogListingHref({ view: 'grid' })).toBe('/blog?view=grid')
  expect(buildBlogListingHref({ page: 2, view: 'grid' })).toBe(
    '/blog?view=grid&page=2',
  )
})
