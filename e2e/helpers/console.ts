import type { Page } from '@playwright/test'

export function collectConsoleErrors(page: Page): string[] {
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
