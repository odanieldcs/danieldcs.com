import { expect, test } from '@playwright/test'

test('hello-world article renders title, date, tags, and body', async ({
  page,
}) => {
  await page.goto('/blog/hello-world')

  await expect(page).toHaveTitle('Hello World')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'Fixture post for the content system loaders.',
  )
  await expect(
    page.getByRole('heading', { level: 1, name: 'Hello World' }),
  ).toBeVisible()
  await expect(page.locator('time')).toHaveText('2026-09-21')
  await expect(page.getByText('hello', { exact: true })).toBeVisible()
  await expect(page.getByText('exercise the content loaders')).toBeVisible()
  await expect(page.getByRole('img', { name: 'Hello World' })).toBeVisible()
})

test('missing slug returns 404', async ({ page }) => {
  const response = await page.goto('/blog/slug-inexistente')

  expect(response?.status()).toBe(404)
})
