import { afterEach, expect, test, vi } from 'vitest'
import {
  bindAnalyticsCapture,
  isAnalyticsEnabled,
  resetAnalyticsStateForTests,
  track,
} from './analytics'

const productionEnv = {
  NEXT_PUBLIC_VERCEL_ENV: 'production',
  NEXT_PUBLIC_POSTHOG_KEY: 'phc_test',
} as const

afterEach(() => {
  vi.unstubAllEnvs()
  resetAnalyticsStateForTests()
})

test('analytics gate passes in production with key and no webdriver', () => {
  expect(isAnalyticsEnabled(productionEnv, { webdriver: false })).toBe(true)
})

test.each([
  ['preview', productionEnv.NEXT_PUBLIC_POSTHOG_KEY],
  ['development', productionEnv.NEXT_PUBLIC_POSTHOG_KEY],
  ['production', ''],
  ['production', undefined],
] as const)('analytics gate fails for env=%s key=%s', (vercelEnv, key) => {
  expect(
    isAnalyticsEnabled(
      {
        NEXT_PUBLIC_VERCEL_ENV: vercelEnv,
        NEXT_PUBLIC_POSTHOG_KEY: key,
      },
      { webdriver: false },
    ),
  ).toBe(false)
})

test('analytics gate fails when webdriver is true', () => {
  expect(isAnalyticsEnabled(productionEnv, { webdriver: true })).toBe(false)
})

test('track is a no-op when the gate is closed', () => {
  const capture = vi.fn()
  bindAnalyticsCapture(capture)

  track({
    name: 'cta_click',
    properties: { cta: 'nav_item', location: 'header', target: 'blog' },
  })

  expect(capture).not.toHaveBeenCalled()
})

test('track queues events until capture is bound', () => {
  vi.stubEnv('NEXT_PUBLIC_VERCEL_ENV', 'production')
  vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'phc_test')

  const capture = vi.fn()
  track({
    name: 'article_read',
    properties: { slug: 'hello', language: 'en' },
  })
  track({
    name: 'external_link_click',
    properties: { href_host: 'github.com', source: 'footer' },
  })

  expect(capture).not.toHaveBeenCalled()

  bindAnalyticsCapture(capture)

  expect(capture).toHaveBeenCalledTimes(2)
  expect(capture.mock.calls[0]?.[0]).toEqual({
    name: 'article_read',
    properties: { slug: 'hello', language: 'en' },
  })
  expect(capture.mock.calls[1]?.[0]).toEqual({
    name: 'external_link_click',
    properties: { href_host: 'github.com', source: 'footer' },
  })
})

test('track sends immediately when capture is already bound', () => {
  vi.stubEnv('NEXT_PUBLIC_VERCEL_ENV', 'production')
  vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'phc_test')

  const capture = vi.fn()
  bindAnalyticsCapture(capture)
  capture.mockClear()

  track({
    name: 'cta_click',
    properties: {
      cta: 'language_switch',
      location: 'header',
      target: 'en',
    },
  })

  expect(capture).toHaveBeenCalledOnce()
})

function assertInvalidAnalyticsEventsAreRejected() {
  // @ts-expect-error -- unknown event name
  track({ name: 'page_view', properties: {} })
}

void assertInvalidAnalyticsEventsAreRejected
