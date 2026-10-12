import type { Page } from '@playwright/test'

const hydrationWarning = /hydration|did not match|server-rendered html/i

export type ConsoleIssue = {
  text: string
  locationUrl?: string
}

export function collectConsoleErrors(page: Page): ConsoleIssue[] {
  const consoleErrors: ConsoleIssue[] = []

  page.on('console', (msg) => {
    const text = msg.text()
    if (
      msg.type() === 'error' ||
      (msg.type() === 'warning' && hydrationWarning.test(text))
    ) {
      consoleErrors.push({ text, locationUrl: msg.location().url })
    }
  })

  page.on('pageerror', (error) => {
    consoleErrors.push({ text: error.message })
  })

  return consoleErrors
}
