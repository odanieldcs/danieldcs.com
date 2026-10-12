import { expect, test } from '@playwright/test'

const geistMonoFile = /GeistMono/i

const postWithInlineCode = '/blog/css-flexbox-guia-pratico'

function computedFamilyUsesVariable(computed: string, variable: string) {
  const normalizedVariable = variable.trim().replaceAll(/['"]/g, '')
  const normalizedComputed = computed.trim().replaceAll(/['"]/g, '')
  return (
    normalizedVariable.length > 0 &&
    normalizedComputed.startsWith(normalizedVariable)
  )
}

test('home HTML and requests omit Geist Mono', async ({ page, request }) => {
  const response = await request.get('/')
  expect(response.ok()).toBe(true)
  const html = await response.text()

  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    if (/rel=["']preload["']/.test(tag)) {
      expect(tag).not.toMatch(geistMonoFile)
    }
  }

  const fontRequests: string[] = []
  page.on('request', (fontRequest) => {
    if (geistMonoFile.test(fontRequest.url())) {
      fontRequests.push(fontRequest.url())
    }
  })

  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)

  expect(fontRequests).toEqual([])
})

test('a post with code loads Geist Mono for blocks, labels, and inline code', async ({
  page,
}) => {
  const fontRequests: string[] = []
  page.on('request', (fontRequest) => {
    if (
      geistMonoFile.test(fontRequest.url()) &&
      fontRequest.url().includes('.woff2')
    ) {
      fontRequests.push(fontRequest.url())
    }
  })

  await page.goto(postWithInlineCode)

  const families = await page.evaluate(() => {
    const variable = getComputedStyle(document.documentElement)
      .getPropertyValue('--font-geist-mono')
      .trim()
    const pre = document.querySelector('pre.shiki[data-language]')
    const inline = document.querySelector('main p code')
    if (!pre || !inline) {
      return null
    }

    return {
      variable,
      pre: getComputedStyle(pre).fontFamily,
      label: getComputedStyle(pre, '::after').fontFamily,
      inline: getComputedStyle(inline).fontFamily,
    }
  })

  expect(families).not.toBeNull()
  if (!families) {
    return
  }

  expect(computedFamilyUsesVariable(families.pre, families.variable)).toBe(true)
  expect(computedFamilyUsesVariable(families.label, families.variable)).toBe(
    true,
  )
  expect(computedFamilyUsesVariable(families.inline, families.variable)).toBe(
    true,
  )

  await page.evaluate(() => document.fonts.ready)
  expect(fontRequests.length).toBeGreaterThan(0)
})
