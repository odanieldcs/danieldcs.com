import { expect, test } from '@playwright/test'

const postPath = '/blog/postgresql-e-pgadmin-com-docker-compose'

for (const path of ['/', postPath] as const) {
  test(`document load on ${path} does not run page-in`, async ({ page }) => {
    await page.goto(path)
    await expect(page.locator('[data-page-enter]')).toHaveCSS(
      'animation-name',
      'none',
    )
  })
}

test('client navigation fades the page in', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('banner').getByRole('link', { name: 'Sobre' }).click()
  await expect(page).toHaveURL('/about')
  await expect(page.locator('[data-page-enter]')).toHaveCSS(
    'animation-name',
    'page-in',
  )
})

test('reduced motion skips the navigation fade', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByRole('banner').getByRole('link', { name: 'Sobre' }).click()
  await expect(page).toHaveURL('/about')
  await expect(page.locator('[data-page-enter]')).toHaveCSS(
    'animation-name',
    'none',
  )
})
