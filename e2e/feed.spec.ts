import { expect, test } from '@playwright/test'
import { xmlTextContents } from './helpers/xml'

function canonicalHref(html: string) {
  const document = new DOMParser().parseFromString(html, 'text/html')
  return (
    document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? ''
  )
}

test('the rss feed is served and each guid is that post canonical', async ({
  page,
  request,
}) => {
  test.setTimeout(180_000)
  const response = await request.get('/feed', { maxRedirects: 0 })

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/rss+xml')

  const guids = await xmlTextContents(page, await response.text(), 'guid')
  expect(guids.length).toBeGreaterThan(0)

  for (const guid of guids) {
    const post = await request.get(new URL(guid).pathname, { maxRedirects: 0 })
    expect(post.status(), guid).toBe(200)
    const canonical = await page.evaluate(canonicalHref, await post.text())
    expect(canonical, guid).toBe(guid)
  }
})
