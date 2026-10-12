import { test } from '@playwright/test'
import {
  expectNoHorizontalOverflow,
  openForOverflowCheck,
  overflowRoutes,
} from './helpers/overflow'

const widths = [320, 390] as const
const routes = overflowRoutes()

// Pixel 7 only selects this project.
test.describe('horizontal overflow', { tag: '@mobile' }, () => {
  for (const route of routes) {
    for (const width of widths) {
      test(`${route} does not overflow at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 844 })
        await openForOverflowCheck(page, route)
        await expectNoHorizontalOverflow(page, route, width)
      })
    }
  }
})
