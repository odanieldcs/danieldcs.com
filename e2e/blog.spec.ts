import { expect, test } from '@playwright/test'

test('blog listing shows 12 posts on page 1 without console errors', async ({
  page,
}) => {
  const consoleErrors: string[] = []

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text())
    }
  })

  page.on('pageerror', (error) => {
    consoleErrors.push(error.message)
  })

  await page.goto('/blog')

  await expect(page).toHaveTitle('Blog')
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Aprendizados e ideias.',
    }),
  ).toBeVisible()
  await expect(
    page.getByRole('link', {
      name: 'Como o content system renderiza um artigo',
    }),
  ).toBeVisible()

  const postList = page.locator('main ul').first()
  await expect(postList.locator(':scope > li')).toHaveCount(12)

  expect(consoleErrors).toEqual([])
})

test('blog listing opens a post and paginates to page 2', async ({ page }) => {
  await page.goto('/blog')

  await page
    .getByRole('link', { name: 'Como o content system renderiza um artigo' })
    .click()
  await expect(page).toHaveURL('/blog/content-system')

  await page.goto('/blog')
  await page
    .getByRole('navigation', { name: 'Paginação' })
    .getByRole('link', { name: '2', exact: true })
    .click()
  await expect(page).toHaveURL('/blog?page=2')
  await expect(
    page.locator('main ul').first().locator(':scope > li'),
  ).toHaveCount(2)
})

test('content-system article renders without console errors and highlights code', async ({
  page,
}) => {
  const consoleErrors: string[] = []

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text())
    }
  })

  page.on('pageerror', (error) => {
    consoleErrors.push(error.message)
  })

  await page.goto('/blog/content-system')

  await expect(page).toHaveTitle('Como o content system renderiza um artigo')
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Como o content system renderiza um artigo',
    }),
  ).toBeVisible()
  await expect(page.locator('pre.shiki')).toHaveCount(2)
  await expect(
    page.locator('pre.shiki[data-language="ts"]').first(),
  ).toBeVisible()
  await expect(
    page.locator('.line[data-highlight="true"]').first(),
  ).toBeVisible()
  expect(consoleErrors).toEqual([])
})

test('missing slug returns 404', async ({ page }) => {
  const response = await page.goto('/blog/slug-inexistente')

  expect(response?.status()).toBe(404)
})
