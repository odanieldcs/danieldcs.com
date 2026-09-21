import { expect, test } from '@playwright/test'

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
  await expect(page.locator('pre.shiki')).toHaveCount(1)
  expect(consoleErrors).toEqual([])
})

test('missing slug returns 404', async ({ page }) => {
  const response = await page.goto('/blog/slug-inexistente')

  expect(response?.status()).toBe(404)
})
