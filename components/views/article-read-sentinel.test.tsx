import { cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import type { AnalyticsEvent } from '@/lib/analytics'
import { ArticleReadSentinel } from './article-read-sentinel'

const track = vi.fn()
const isAnalyticsEnabled = vi.fn()

vi.mock('@/lib/analytics', () => ({
  isAnalyticsEnabled: () => isAnalyticsEnabled(),
  track: (event: AnalyticsEvent) => track(event),
}))

let observerCallback: IntersectionObserverCallback | null = null
const observe = vi.fn()
const disconnect = vi.fn()

class MockIntersectionObserver {
  observe = observe
  disconnect = disconnect

  constructor(callback: IntersectionObserverCallback) {
    observerCallback = callback
  }
}

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
  track.mockClear()
  isAnalyticsEnabled.mockReturnValue(true)
  observe.mockClear()
  disconnect.mockClear()
  observerCallback = null
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

function fireIntersection(isIntersecting: boolean) {
  if (!observerCallback) {
    throw new Error('IntersectionObserver callback was not registered')
  }
  observerCallback(
    [{ isIntersecting } as IntersectionObserverEntry],
    {} as IntersectionObserver,
  )
}

test('does not observe or track when analytics gate is closed', () => {
  isAnalyticsEnabled.mockReturnValue(false)

  render(<ArticleReadSentinel slug="my-post" language="pt" />)

  expect(observe).not.toHaveBeenCalled()
  expect(track).not.toHaveBeenCalled()
})

test('tracks article_read once on first intersection', () => {
  render(<ArticleReadSentinel slug="my-post" language="en" />)

  expect(observe).toHaveBeenCalledTimes(1)
  fireIntersection(true)

  expect(track).toHaveBeenCalledTimes(1)
  expect(track).toHaveBeenCalledWith({
    name: 'article_read',
    properties: { slug: 'my-post', language: 'en' },
  })
  expect(disconnect).toHaveBeenCalled()
})

test('does not track again on a second intersection in the same mount', () => {
  render(<ArticleReadSentinel slug="my-post" language="pt" />)

  fireIntersection(true)
  fireIntersection(true)

  expect(track).toHaveBeenCalledTimes(1)
})

test('tracks again after remount with a new slug', () => {
  const { rerender } = render(
    <ArticleReadSentinel key="a" slug="post-a" language="pt" />,
  )
  fireIntersection(true)

  rerender(<ArticleReadSentinel key="b" slug="post-b" language="pt" />)
  fireIntersection(true)

  expect(track).toHaveBeenCalledTimes(2)
  expect(track).toHaveBeenNthCalledWith(1, {
    name: 'article_read',
    properties: { slug: 'post-a', language: 'pt' },
  })
  expect(track).toHaveBeenNthCalledWith(2, {
    name: 'article_read',
    properties: { slug: 'post-b', language: 'pt' },
  })
})

test('disconnects observer on unmount when gate is open', () => {
  const { unmount } = render(
    <ArticleReadSentinel slug="my-post" language="pt" />,
  )

  unmount()

  expect(disconnect).toHaveBeenCalled()
})
