import { afterEach, expect, test, vi } from 'vitest'
import {
  bindAnalyticsCapture,
  bindErrorCapture,
  captureError,
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

test('captureError is a no-op when the gate is closed', () => {
  const capture = vi.fn()
  bindErrorCapture(capture)

  captureError(new Error('fail'), { boundary: 'route' })

  expect(capture).not.toHaveBeenCalled()
})

test('captureError queues until bind and drops oldest beyond 10', () => {
  vi.stubEnv('NEXT_PUBLIC_VERCEL_ENV', 'production')
  vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'phc_test')

  const capture = vi.fn()
  for (let index = 0; index < 12; index += 1) {
    captureError(new Error(`e-${index}`), { boundary: 'route' })
  }

  expect(capture).not.toHaveBeenCalled()

  bindErrorCapture(capture)

  expect(capture).toHaveBeenCalledTimes(10)
  expect(capture.mock.calls[0]?.[0]).toMatchObject({ message: 'e-2' })
  expect(capture.mock.calls[9]?.[0]).toMatchObject({ message: 'e-11' })
})

test('captureError sends immediately when error capture is already bound', () => {
  vi.stubEnv('NEXT_PUBLIC_VERCEL_ENV', 'production')
  vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'phc_test')

  const capture = vi.fn()
  bindErrorCapture(capture)
  capture.mockClear()

  const error = new Error('boom')
  captureError(error, { boundary: 'global', digest: 'abc123' })

  expect(capture).toHaveBeenCalledOnce()
  expect(capture.mock.calls[0]?.[0]).toBe(error)
  expect(capture.mock.calls[0]?.[1]).toEqual({
    boundary: 'global',
    digest: 'abc123',
  })
})
