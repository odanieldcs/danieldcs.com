import AxeBuilder from '@axe-core/playwright'
import type { Page } from '@playwright/test'

const wcagTags = [
  'wcag2a',
  'wcag2aa',
  'wcag21a',
  'wcag21aa',
  'wcag22aa',
] as const

/** WCAG A/AA violations. `incomplete` results are left out of the assertion. */
export function collectAxeViolations(page: Page) {
  return new AxeBuilder({ page })
    .withTags([...wcagTags])
    .analyze()
    .then((results) => results.violations)
}
