import { expect, test } from '@playwright/test'
import { collectConsoleErrors } from './helpers/console'
import { getNewestBlogPost } from './helpers/posts'

const newestPost = getNewestBlogPost('analytics guard')

const routes = [
  {
    path: '/',
    navAriaLabel: 'Navegação principal',
    navItem: 'Comunidade',
    destination: '/community',
  },
  {
    path: '/blog',
    navAriaLabel: 'Navegação principal',
    navItem: 'Comunidade',
    destination: '/community',
  },
  {
    path: `/blog/${newestPost.slug}`,
    navAriaLabel: 'Navegação principal',
    navItem: 'Comunidade',
    destination: '/community',
  },
  {
    path: '/en',
    navAriaLabel: 'Main navigation',
    navItem: 'Community',
    destination: '/en/community',
  },
  {
    path: '/en/blog',
    navAriaLabel: 'Main navigation',
    navItem: 'Community',
    destination: '/en/community',
  },
  {
    path: '/privacy',
    navAriaLabel: 'Navegação principal',
    navItem: 'Comunidade',
    destination: '/community',
  },
] as const

function mentionsPostHog(value: string): boolean {
  return value.includes('ph_') || value.includes('posthog')
}

test.describe('analytics guard', () => {
  for (const route of routes) {
    test(`${route.path} sends no PostHog traffic`, async ({
      page,
      context,
    }) => {
      const posthogRequests: string[] = []
      // The SDK treats `navigator.webdriver` as a bot and drops ingest before
      // any request to its host. An open gate still downloads the lazy init
      // chunk (`us.i.posthog.com` in lib/analytics-init.ts).
      const lazyInitChunks: Promise<string | null>[] = []

      page.on('request', (request) => {
        const url = request.url()
        if (!URL.canParse(url)) {
          return
        }
        if (new URL(url).host.includes('posthog')) {
          posthogRequests.push(url)
        }
      })

      page.on('response', (response) => {
        const url = response.url()
        if (!url.includes('/_next/static/chunks/')) {
          return
        }
        lazyInitChunks.push(
          response
            .text()
            .then((body) => (body.includes('us.i.posthog.com') ? url : null))
            .catch(() => null),
        )
      })

      const consoleErrors = collectConsoleErrors(page)

      await page.goto(route.path, { waitUntil: 'load' })
      // Lazy init waits for `load`, then `requestIdleCallback`, before importing
      // PostHog (`scheduleOnLoad` in lib/analytics-schedule.ts). This pause covers
      // that idle callback so an open gate would still emit traffic here.
      await page.waitForTimeout(1500)

      await page
        .getByRole('navigation', { name: route.navAriaLabel })
        .getByRole('link', { name: route.navItem })
        .click()
      await expect(page).toHaveURL(route.destination)

      expect(posthogRequests).toEqual([])
      expect((await Promise.all(lazyInitChunks)).filter(Boolean)).toEqual([])
      expect(consoleErrors).toEqual([])

      const cookieNames = (await context.cookies()).map((cookie) => cookie.name)
      expect(cookieNames.filter(mentionsPostHog)).toEqual([])

      const storageKeys = await page.evaluate(() => Object.keys(localStorage))
      expect(storageKeys.filter(mentionsPostHog)).toEqual([])
    })
  }
})
