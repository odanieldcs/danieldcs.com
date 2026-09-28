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

  await expect(page).toHaveTitle('Blog')
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

  await expect(page).toHaveTitle('PostgreSQL e pgAdmin com Docker Compose')
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

test('missing slug returns 404', async ({ page }) => {
  const response = await page.goto('/blog/slug-inexistente')

  expect(response?.status()).toBe(404)

  const removedPlaceholder = await page.goto('/blog/content-system')

  expect(removedPlaceholder?.status()).toBe(404)
})
