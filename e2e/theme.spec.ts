import { expect, test } from '@playwright/test'
import { collectConsoleErrors } from './helpers/console'
import { getNewestBlogPost } from './helpers/posts'

const blogPostPath = `/blog/${getNewestBlogPost('theme').slug}` as const

const lightBackground = 'rgb(242, 235, 235)'
const darkBackground = 'rgb(16, 13, 13)'
const lightForeground = 'lab(10.2215 -2.79985 1.40786)'
const darkForeground = 'rgb(236, 236, 236)'

async function expectThemeTokens(
  page: import('@playwright/test').Page,
  scheme: 'light' | 'dark',
) {
  const isDark = scheme === 'dark'

  const html = page.locator('html')
  if (isDark) {
    await expect(html).toHaveClass(/\bdark\b/, { timeout: 5000 })
  } else {
    await expect(html).not.toHaveClass(/\bdark\b/)
  }

  await expect(page.locator('body')).toHaveCSS(
    'background-color',
    isDark ? darkBackground : lightBackground,
  )
  await expect(page.locator('body')).toHaveCSS(
    'color',
    isDark ? darkForeground : lightForeground,
  )
}

for (const path of ['/', blogPostPath] as const) {
  test(`defaults to dark on ${path} when OS prefers light`, async ({
    page,
  }) => {
    const consoleErrors = collectConsoleErrors(page)

    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto(path)
    await expectThemeTokens(page, 'dark')
    expect(consoleErrors).toEqual([])
  })
}

test('light theme choice persists across reload and navigation', async ({
  page,
}) => {
  const consoleErrors = collectConsoleErrors(page)

  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await expectThemeTokens(page, 'dark')

  await page.getByRole('button', { name: 'Modo claro' }).click()
  await expectThemeTokens(page, 'light')

  await page.reload()
  await expectThemeTokens(page, 'light')

  await page.goto(blogPostPath)
  await expectThemeTokens(page, 'light')
  expect(consoleErrors).toEqual([])
})
