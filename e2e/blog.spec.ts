import { expect, test } from '@playwright/test'
import { BLOG_PAGE_SIZE } from '@/lib/blog/pagination'
import { collectConsoleErrors } from './helpers/console'
import { getBlogPostCount, getNewestBlogPost } from './helpers/posts'

const total = getBlogPostCount('blog listing')
const newestPost = getNewestBlogPost('blog listing')

test('blog listing shows posts on page 1 without console errors', async ({
  page,
}) => {
  const consoleErrors = collectConsoleErrors(page)

  await page.goto('/blog')

  await expect(page).toHaveTitle('Blog · Daniel Castro')
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Aprendizados e ideias.',
    }),
  ).toBeVisible()
  await expect(
    page.getByRole('link', { name: newestPost.frontmatter.title }),
  ).toBeVisible()

  const postList = page.locator('main ul').first()
  await expect(postList.locator(':scope > li')).toHaveCount(
    Math.min(total, BLOG_PAGE_SIZE),
  )

  expect(consoleErrors).toEqual([])
})

test('blog listing opens the newest post', async ({ page }) => {
  await page.goto('/blog')

  await page.getByRole('link', { name: newestPost.frontmatter.title }).click()
  await expect(page).toHaveURL(`/blog/${newestPost.slug}`)
})

test('blog listing paginates to page 2', async ({ page }) => {
  test.skip(
    total <= BLOG_PAGE_SIZE,
    'pagination requires more posts than one page',
  )

  await page.goto('/blog')
  await page
    .getByRole('navigation', { name: 'Paginação' })
    .getByRole('link', { name: '2', exact: true })
    .click()
  await expect(page).toHaveURL('/blog?page=2')
  await expect(
    page.locator('main ul').first().locator(':scope > li'),
  ).toHaveCount(Math.min(BLOG_PAGE_SIZE, total - BLOG_PAGE_SIZE))
})

test('postgresql pilot article renders without console errors and code blocks', async ({
  page,
}) => {
  const consoleErrors = collectConsoleErrors(page)

  await page.goto('/blog/postgresql-e-pgadmin-com-docker-compose')

  await expect(page).toHaveTitle(
    'PostgreSQL e pgAdmin com Docker Compose · Daniel Castro',
  )
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'PostgreSQL e pgAdmin com Docker Compose',
    }),
  ).toBeVisible()
  await expect(page.locator('pre.shiki')).toHaveCount(6)
  await expect(
    page.locator('pre.shiki[data-language="yaml"]').first(),
  ).toBeVisible()
  expect(consoleErrors).toEqual([])
})

const postgresqlSlug = 'postgresql-e-pgadmin-com-docker-compose'

test('postgresql article shows localized date and cover width at 1280', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto(`/blog/${postgresqlSlug}`)

  const date = page.locator('article time').first()
  await expect(date).toHaveText('31 jul. 2023')
  await expect(date).toHaveAttribute('datetime', '2023-07-31T00:00:00.000Z')

  const cover = page.locator('article img').first()
  await expect(cover).toBeVisible()
  const box = await cover.boundingBox()
  expect(box?.width).toBe(840)
})

test('postgresql article English date', async ({ page }) => {
  await page.goto(`/en/blog/${postgresqlSlug}`)

  const date = page.locator('article time').first()
  await expect(date).toHaveText('Jul 31, 2023')
  await expect(date).toHaveAttribute('datetime', '2023-07-31T00:00:00.000Z')
})

test('postgresql article cover does not overflow viewport on small screens', async ({
  page,
}) => {
  for (const width of [375, 768] as const) {
    await page.setViewportSize({ width, height: 800 })
    await page.goto(`/blog/${postgresqlSlug}`)

    const coverFitsViewport = await page.evaluate(() => {
      const cover = document.querySelector('article img')
      if (!cover) {
        return true
      }
      const { left, right } = cover.getBoundingClientRect()
      const viewport = document.documentElement.clientWidth
      return left >= -0.5 && right <= viewport + 0.5
    })
    expect(coverFitsViewport).toBe(true)
  }
})

test('missing slug returns 404', async ({ page }) => {
  const response = await page.goto('/blog/slug-inexistente')

  expect(response?.status()).toBe(404)

  const removedPlaceholder = await page.goto('/blog/content-system')

  expect(removedPlaceholder?.status()).toBe(404)
})
