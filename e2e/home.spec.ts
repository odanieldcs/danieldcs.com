import { expect, test } from '@playwright/test'

test('home loads without console errors', async ({ page }) => {
  const consoleErrors: string[] = []

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text())
    }
  })

  page.on('pageerror', (error) => {
    consoleErrors.push(error.message)
  })

  await page.goto('/')

  const main = page.getByRole('main')
  await expect(
    main.getByRole('heading', { level: 1, name: 'Daniel Castro' }),
  ).toBeVisible()
  await expect(main.locator('a[href="/trilha"]')).toBeVisible()
  await expect(main.locator('a[href^="/blog/"]')).not.toHaveCount(0)
  expect(consoleErrors).toEqual([])
})
