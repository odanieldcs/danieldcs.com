import { expect, type Page, test } from '@playwright/test'

test.use({ viewport: { width: 390, height: 844 } })

function focusedRegion(page: Page) {
  return page.evaluate(() => {
    const current = document.activeElement
    if (
      !(current instanceof Element) ||
      current === document.body ||
      current === document.documentElement
    ) {
      return 'body'
    }
    if (current.closest('header')) {
      return 'header'
    }
    if (current.closest('main')) {
      return 'main'
    }
    if (current.closest('footer')) {
      return 'footer'
    }
    if (current.closest('nav')) {
      return 'menu'
    }
    return `other:${current.tagName}#${current.id}.${current.className}`
  })
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Enter and Space open the menu on the Blog link', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Menu' })
  await trigger.focus()
  await page.keyboard.press('Enter')

  const blog = page
    .getByRole('navigation', { name: 'Navegação principal' })
    .getByRole('link', { name: 'Blog' })
  await expect(blog).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()

  await page.keyboard.press('Space')
  await expect(blog).toBeFocused()
})

test('Tab and Shift+Tab stay in the header and the menu', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Menu' })
  await trigger.focus()
  await page.keyboard.press('Enter')

  const blog = page
    .getByRole('navigation', { name: 'Navegação principal' })
    .getByRole('link', { name: 'Blog' })
  await expect(blog).toBeFocused()

  await page.keyboard.press('Shift+Tab')
  expect(await focusedRegion(page)).toBe('header')

  for (let step = 0; step < 10; step += 1) {
    await page.keyboard.press('Shift+Tab')
    const region = await focusedRegion(page)
    expect(['header', 'menu', 'body'], region).toContain(region)
  }

  await blog.focus()
  await expect(blog).toBeFocused()
  await page.keyboard.press('Tab')
  expect(await focusedRegion(page)).toBe('menu')

  for (let step = 0; step < 10; step += 1) {
    await page.keyboard.press('Tab')
    const region = await focusedRegion(page)
    expect(['header', 'menu', 'body'], region).toContain(region)
  }
})

test('Escape returns focus to the trigger and clears inert', async ({
  page,
}) => {
  const trigger = page.getByRole('button', { name: 'Menu' })
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('[inert]').first()).toBeAttached()

  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect(page.locator('[inert]')).toHaveCount(0)
})
