import { test as base } from '@playwright/test'

const postHogHosts = new Set(['us.i.posthog.com', 'us-assets.i.posthog.com'])

export const test = base.extend<{ blockPostHog: undefined }>({
  blockPostHog: [
    async ({ page }, use, testInfo) => {
      if (testInfo.project.name === 'deployed') {
        await page.route(
          (url) => postHogHosts.has(url.hostname),
          (route) => route.abort(),
        )
      }
      await use(undefined)
    },
    { auto: true },
  ],
})
