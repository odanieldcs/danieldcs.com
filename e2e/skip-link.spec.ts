import { expect, type Page, test } from '@playwright/test'

async function skipToMain(page: Page, path: string) {
  await page.goto(path)
  await page.keyboard.press('Tab')

  const skip = page.getByRole('link', { name: 'Pular para o conteúdo' })
  await expect(skip).toBeFocused()

  const box = await skip.boundingBox()
  expect(box?.width ?? 0).toBeGreaterThan(40)
  expect(box?.height ?? 0).toBeGreaterThan(16)
  await expect(skip).toHaveCSS('clip-path', 'none')

  await page.keyboard.press('Enter')

  const main = page.locator('main')
  await expect(main).toBeFocused()
  await expect(main).toHaveCSS('outline-style', 'none')
}

test('first Tab skips to main on the home page', async ({ page }) => {
  await skipToMain(page, '/')
})

test('first Tab skips to main on a post', async ({ page }) => {
  await skipToMain(page, '/blog/meu-blog-profissional')
})

test('open mobile menu makes the skip link inert', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Menu' }).click()

  const skipNav = page.locator('nav[aria-label="Atalho"]')
  const skip = skipNav.locator('a')
  await expect(skipNav).toHaveAttribute('inert')

  for (let step = 0; step < 8; step += 1) {
    await page.keyboard.press('Tab')
    await expect(skip).not.toBeFocused()
  }
})
