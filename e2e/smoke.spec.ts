import { expect } from '@playwright/test'
import { test } from './helpers/block-posthog'

const lightBackground = 'rgb(242, 235, 235)'
const darkBackground = 'rgb(16, 13, 13)'

test.describe('webkit smoke', { tag: '@smoke' }, () => {
  test('home shows the Portuguese H1', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Criando e compartilhando, de Dev para Dev.',
      }),
    ).toBeVisible()
  })

  test('blog shows the blog H1', async ({ page }) => {
    await page.goto('/blog')
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Aprendizados e ideias.',
      }),
    ).toBeVisible()
  })

  test('postgresql article shows its H1', async ({ page }) => {
    await page.goto('/blog/postgresql-e-pgadmin-com-docker-compose')
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'PostgreSQL e pgAdmin com Docker Compose',
      }),
    ).toBeVisible()
  })

  test('theme toggle switches the background', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: 'Modo claro' }).click()
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/)
    await expect(page.locator('body')).toHaveCSS(
      'background-color',
      lightBackground,
    )

    await page.getByRole('button', { name: 'Modo escuro' }).click()
    await expect(page.locator('body')).toHaveCSS(
      'background-color',
      darkBackground,
    )
  })

  test('language switch goes to English and back', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Switch to English' }).click()
    await expect(page).toHaveURL('/en')

    await page.getByRole('link', { name: 'Mudar para português' }).click()
    await expect(page).toHaveURL('/')
  })
})
