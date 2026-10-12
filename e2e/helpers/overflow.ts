import { expect, type Page } from '@playwright/test'
import { guardRoutes } from './guard-routes'
import { getAllBlogPosts } from './posts'

export function overflowRoutes(): string[] {
  const postRoutes = getAllBlogPosts('overflow').map(
    (post) => `/blog/${post.slug}`,
  )

  return [...new Set<string>([...guardRoutes, ...postRoutes])]
}

export async function openForOverflowCheck(page: Page, route: string) {
  // `load` also waits for images. One post never reaches it in CI, which
  // hides the scrollWidth check. Layout is ready with the document and fonts.
  await page.goto(route, { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('main')).toBeVisible()
  await page.evaluate(async () => {
    await document.fonts.ready
  })
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
