import { expect, type Page, test } from '@playwright/test'
import { collectAxeViolations } from './helpers/axe'
import { guardRoutes } from './helpers/guard-routes'

const themes = ['dark', 'light'] as const

type AxeViolation = Awaited<ReturnType<typeof collectAxeViolations>>[number]

function formatViolations(
  route: string,
  theme: (typeof themes)[number],
  violations: AxeViolation[],
): string {
  return violations
    .flatMap((violation) =>
      violation.nodes.map((node) => {
        const selector = node.target
          .map((part) => (Array.isArray(part) ? part.join(' ') : part))
          .join(' ')
        return `${violation.id} on ${route} (${theme}): ${selector}`
      }),
    )
    .join('\n')
}

async function openThemedRoute(
  page: Page,
  route: string,
  theme: (typeof themes)[number],
) {
  await page.addInitScript((value) => {
    localStorage.setItem('theme', value)
  }, theme)
  await page.goto(route)

  const html = page.locator('html')
  if (theme === 'dark') {
    await expect(html).toHaveClass(/\bdark\b/, { timeout: 5000 })
  } else {
    await expect(html).not.toHaveClass(/\bdark\b/)
  }

  await expect(page.getByRole('main')).toBeVisible()
  await page.evaluate(async () => {
    await document.fonts.ready
  })
}

for (const route of guardRoutes) {
  for (const theme of themes) {
    test(`${route} ${theme} has no axe violations`, async ({ page }) => {
      await openThemedRoute(page, route, theme)

      const violations = await collectAxeViolations(page)
      expect(formatViolations(route, theme, violations)).toBe('')
    })
  }
}
