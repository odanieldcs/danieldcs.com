import { expect, test } from '@playwright/test'

test('community opens from the header without console errors', async ({
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

  await page.goto('/')
  await page
    .getByRole('banner')
    .getByRole('link', { name: 'Comunidade' })
    .click()

  await expect(page).toHaveURL('/community')
  await expect(page).toHaveTitle('Comunidade')
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Palestras, workshops e encontros.',
    }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { level: 2, name: '2026' }),
  ).toBeVisible()
  await expect(
    page
      .getByRole('heading', { level: 3, name: 'Exemplo de palestra' })
      .first(),
  ).toBeVisible()

  expect(consoleErrors).toEqual([])
})
