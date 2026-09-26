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
  const hero = main.locator('section').first()

  await expect(
    main.getByRole('heading', {
      level: 1,
      name: 'Criando e compartilhando, de Dev para Dev.',
    }),
  ).toBeVisible()
  await expect(
    main.getByRole('img', {
      name: 'Daniel Castro palestrando no palco do TDC Floripa em 2026, com microfone',
    }),
  ).toBeVisible()
  await expect(hero.locator('a[href="/trilha"]')).toHaveCount(0)
  await expect(main.locator('a[href="/trilha"]')).toHaveCount(0)
  await expect(main.locator('a[href^="/blog/"]')).not.toHaveCount(0)

  const header = page.getByRole('banner')
  await expect(
    header.getByRole('button', { name: 'Modo escuro' }),
  ).toBeVisible()
  await expect(
    header.getByRole('button', { name: 'Switch to English' }),
  ).toBeVisible()

  const footer = page.getByRole('contentinfo')
  for (const name of ['LinkedIn', 'GitHub', 'YouTube', 'Instagram']) {
    await expect(footer.getByRole('link', { name })).toBeVisible()
  }

  expect(consoleErrors).toEqual([])
})
