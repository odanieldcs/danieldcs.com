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
  await expect(
    page.getByRole('heading', { level: 1, name: 'danieldcs.com' }),
  ).toBeVisible()
  expect(consoleErrors).toEqual([])
})
