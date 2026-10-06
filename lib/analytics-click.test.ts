import { afterEach, expect, test, vi } from 'vitest'
import { bindAnalyticsCapture, resetAnalyticsStateForTests } from './analytics'
import {
  eventFromClick,
  registerClickTracking,
  unregisterClickTrackingForTests,
} from './analytics-click'

const siteHost = 'danieldcs.com'

afterEach(() => {
  vi.unstubAllEnvs()
  resetAnalyticsStateForTests()
  unregisterClickTrackingForTests()
  document.body.replaceChildren()
})

function mount(html: string): void {
  document.body.innerHTML = html
}

function queryAnchor(): HTMLAnchorElement {
  const anchor = document.querySelector('a')
  if (!anchor) {
    throw new Error('Expected an anchor in the test DOM')
  }
  return anchor
}

test('eventFromClick returns cta_click from anchor or child', () => {
  mount(
    '<a href="/blog" data-cta="nav_item" data-cta-location="header" data-cta-target="blog"><span>Label</span></a>',
  )
  const anchor = queryAnchor()
  const span = document.querySelector('span')
  if (!span) {
    throw new Error('Expected span in the test DOM')
  }

  expect(eventFromClick(anchor, siteHost)).toEqual({
    name: 'cta_click',
    properties: { cta: 'nav_item', location: 'header', target: 'blog' },
  })
  expect(eventFromClick(span, siteHost)).toEqual({
    name: 'cta_click',
    properties: { cta: 'nav_item', location: 'header', target: 'blog' },
  })
})

test('external link with data-cta yields cta_click only', () => {
  mount(
    '<a href="https://github.com/foo" data-cta="linkedin_experience" data-cta-location="about">GitHub</a>',
  )

  expect(eventFromClick(queryAnchor(), siteHost)).toEqual({
    name: 'cta_click',
    properties: { cta: 'linkedin_experience', location: 'about' },
  })
})

test('mailto with data-cta yields cta_click; without data-cta yields null', () => {
  mount(
    '<a href="mailto:hi@danieldcs.com" data-cta="contact_email" data-cta-location="about">Email</a>',
  )
  expect(eventFromClick(queryAnchor(), siteHost)).toEqual({
    name: 'cta_click',
    properties: { cta: 'contact_email', location: 'about' },
  })

  mount('<a href="mailto:hi@danieldcs.com">Email</a>')
  expect(eventFromClick(queryAnchor(), siteHost)).toBeNull()
})

test('internal link without data-cta yields null', () => {
  mount('<a href="/blog/hello">Post</a>')
  expect(eventFromClick(queryAnchor(), siteHost)).toBeNull()
})

test('external link source falls back to unknown', () => {
  mount('<a href="https://github.com/foo">GitHub</a>')
  expect(eventFromClick(queryAnchor(), siteHost)).toEqual({
    name: 'external_link_click',
    properties: { href_host: 'github.com', source: 'unknown' },
  })

  mount(
    '<main data-analytics-source="not-a-source"><a href="https://github.com/foo">GitHub</a></main>',
  )
  expect(eventFromClick(queryAnchor(), siteHost)).toEqual({
    name: 'external_link_click',
    properties: { href_host: 'github.com', source: 'unknown' },
  })
})

test('external link inherits data-analytics-source from ancestor', () => {
  mount(
    '<footer data-analytics-source="footer"><a href="https://github.com/foo">GitHub</a></footer>',
  )
  expect(eventFromClick(queryAnchor(), siteHost)).toEqual({
    name: 'external_link_click',
    properties: { href_host: 'github.com', source: 'footer' },
  })
})

test('invalid cta or location yields null', () => {
  mount('<a href="/blog" data-cta="bad" data-cta-location="header">X</a>')
  expect(eventFromClick(queryAnchor(), siteHost)).toBeNull()

  mount('<a href="/blog" data-cta="nav_item" data-cta-location="bad">X</a>')
  expect(eventFromClick(queryAnchor(), siteHost)).toBeNull()
})

test('registerClickTracking dispatches click but not auxclick', () => {
  vi.stubEnv('NEXT_PUBLIC_VERCEL_ENV', 'production')
  vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'phc_test')

  const capture = vi.fn()
  bindAnalyticsCapture(capture)

  mount(
    '<a href="https://github.com/foo" data-analytics-source="footer">GitHub</a>',
  )
  registerClickTracking()
  registerClickTracking()

  const anchor = queryAnchor()
  anchor.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  expect(capture).toHaveBeenCalledOnce()

  anchor.dispatchEvent(new MouseEvent('auxclick', { bubbles: true }))
  expect(capture).toHaveBeenCalledOnce()
})
