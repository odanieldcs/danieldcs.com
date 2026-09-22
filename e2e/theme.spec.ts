import { expect, test } from '@playwright/test'

const lightBackground = 'rgb(247, 247, 248)'
const darkBackground = 'rgb(33, 33, 33)'
const lightForeground = 'rgb(26, 26, 26)'
const darkForeground = 'rgb(236, 236, 236)'

function collectConsoleErrors(page: import('@playwright/test').Page) {
  const consoleErrors: string[] = []

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text())
    }
  })

  page.on('pageerror', (error) => {
    consoleErrors.push(error.message)
  })

  return consoleErrors
}

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

for (const path of ['/', '/blog/content-system'] as const) {
  test(`system light theme tokens on ${path}`, async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page)

    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto(path)
    await expectThemeTokens(page, 'light')
    expect(consoleErrors).toEqual([])
  })

  test(`system dark theme tokens on ${path}`, async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page)

    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto(path)
    await expectThemeTokens(page, 'dark')
    expect(consoleErrors).toEqual([])
  })
}
