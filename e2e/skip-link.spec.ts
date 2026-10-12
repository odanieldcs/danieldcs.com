import { expect, type Page, test } from '@playwright/test'

async function skipToContent(page: Page, path: string) {
  await page.goto(path)
  await page.keyboard.press('Tab')

  const skip = page.getByRole('link', { name: 'Pular para o conteúdo' })
  await expect(skip).toBeFocused()

  const box = await skip.boundingBox()
  expect(box?.width ?? 0).toBeGreaterThan(40)
  expect(box?.height ?? 0).toBeGreaterThan(16)
  await expect(skip).toHaveCSS('clip-path', 'none')

  await page.keyboard.press('Enter')

  const target = page.locator('#conteudo')
  await expect(target).toBeFocused()
  await expect(target).toHaveCSS('outline-style', 'none')
}

test('first Tab skips to content on the home page', async ({ page }) => {
  await skipToContent(page, '/')
})

test('first Tab skips to content on a post', async ({ page }) => {
  await skipToContent(page, '/blog/meu-blog-profissional')
})

test('open mobile menu makes the skip link inert', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Menu' }).click()

  const skip = page.locator('a[href="#conteudo"]')
  await expect(skip).toHaveAttribute('inert')

  for (let step = 0; step < 8; step += 1) {
    await page.keyboard.press('Tab')
    await expect(skip).not.toBeFocused()
  }
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('Enter then Tab reaches the first content link on the home page', async ({
    page,
  }) => {
    await skipWithoutJavaScript(page, '/')
  })

  test('Enter then Tab reaches the first content link on a post', async ({
    page,
  }) => {
    await skipWithoutJavaScript(page, '/blog/meu-blog-profissional')
  })
})

async function skipWithoutJavaScript(page: Page, path: string) {
  await page.goto(path)
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('link', { name: 'Pular para o conteúdo' }),
  ).toBeFocused()

  await page.keyboard.press('Enter')
  await expect(page.locator('#conteudo')).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(page.locator('#conteudo a').first()).toBeFocused()
}
