import { expect, test } from '@playwright/test'
import { type ConsoleIssue, collectConsoleErrors } from './helpers/console'
import { guardRoutes } from './helpers/guard-routes'

/**
 * Chromium logs the 404 document as
 * "Failed to load resource: the server responded with a status of 404".
 * That message is ignored only on `/qualquer`, and only when `location().url`
 * is that document. Any other 404, on any route, fails the test.
 */
function isAllowedDocument404(route: string, issue: ConsoleIssue): boolean {
  if (route !== '/qualquer' || !issue.locationUrl) {
    return false
  }

  const pathname = URL.parse(issue.locationUrl)?.pathname
  return (
    pathname === '/qualquer' &&
    issue.text.includes('Failed to load resource') &&
    issue.text.includes('404')
  )
}

for (const route of guardRoutes) {
  test(`${route} has no console errors`, async ({ page }) => {
    const issues = collectConsoleErrors(page)
    await page.goto(route)
    await expect(page.getByRole('main')).toBeVisible()

    expect(
      issues.filter((issue) => !isAllowedDocument404(route, issue)),
    ).toEqual([])
  })
}
