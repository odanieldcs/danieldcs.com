import { expect, type Page } from '@playwright/test'
import { guardRoutes } from './guard-routes'
import { getAllBlogPosts } from './posts'

export function overflowRoutes(): string[] {
  const postRoutes = getAllBlogPosts('overflow').map(
    (post) => `/blog/${post.slug}`,
  )

  return [...new Set<string>([...guardRoutes, ...postRoutes])]
}

export async function expectNoHorizontalOverflow(
  page: Page,
  route: string,
  width: number,
) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))

  expect(
    scrollWidth,
    `${route} at ${width}px overflows: scrollWidth ${scrollWidth}, clientWidth ${clientWidth}`,
  ).toBe(clientWidth)
}
