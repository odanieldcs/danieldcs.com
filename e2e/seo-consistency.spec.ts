import {
  type APIRequestContext,
  expect,
  type Page,
  test,
} from '@playwright/test'
import { getNewestBlogPost } from './helpers/posts'
import { xmlTextContents } from './helpers/xml'

function sitePath(absolute: string): string {
  const url = new URL(absolute)
  return `${url.pathname}${url.search}`
}

function normalizeAbsolute(absolute: string): string {
  const url = new URL(absolute)
  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1)
  }
  url.hash = ''
  return url.href
}

function isPortuguesePost(absolute: string): boolean {
  return /^\/blog\/[^/]+$/.test(new URL(absolute).pathname)
}

function parseHtml(html: string) {
  function collectInLanguages(value: unknown, found: string[]) {
    if (Array.isArray(value)) {
      for (const entry of value) {
        collectInLanguages(entry, found)
      }
      return
    }
    if (!value || typeof value !== 'object') {
      return
    }
    for (const [key, entry] of Object.entries(value)) {
      if (key === 'inLanguage' && typeof entry === 'string') {
        found.push(entry)
      } else {
        collectInLanguages(entry, found)
      }
    }
  }

  const document = new DOMParser().parseFromString(html, 'text/html')
  const content = (selector: string, attribute: string) =>
    document.querySelector(selector)?.getAttribute(attribute) ?? ''
  const hreflang: Record<string, string> = {}

  for (const link of document.querySelectorAll('link[rel="alternate"]')) {
    const lang = link.getAttribute('hreflang')
    const href = link.getAttribute('href')
    if (lang && href) {
      hreflang[lang] = href
    }
  }

  const inLanguages: string[] = []
  let jsonLdError = ''
  for (const script of document.querySelectorAll(
    'script[type="application/ld+json"]',
  )) {
    try {
      collectInLanguages(JSON.parse(script.textContent ?? '{}'), inLanguages)
    } catch (error) {
      jsonLdError = error instanceof Error ? error.message : 'invalid JSON-LD'
    }
  }

  return {
    lang: document.documentElement.lang,
    title: document.querySelector('title')?.textContent?.trim() ?? '',
    description: content('meta[name="description"]', 'content'),
    canonical: content('link[rel="canonical"]', 'href'),
    ogTitle: content('meta[property="og:title"]', 'content'),
    ogDescription: content('meta[property="og:description"]', 'content'),
    ogUrl: content('meta[property="og:url"]', 'content'),
    ogImage: content('meta[property="og:image"]', 'content'),
    ogLocale: content('meta[property="og:locale"]', 'content'),
    hreflang,
    inLanguages,
    jsonLdError,
  }
}

async function sitemapLocs(page: Page, request: APIRequestContext) {
  const response = await request.get('/sitemap.xml', { maxRedirects: 0 })
  expect(response.status()).toBe(200)
  const locs = await xmlTextContents(page, await response.text(), 'loc')
  expect(locs.length).toBeGreaterThan(0)
  return locs
}

test('every sitemap url is indexable and consistent across language signals', async ({
  page,
  request,
}) => {
  test.setTimeout(180_000)
  const locs = await sitemapLocs(page, request)
  const other: string[] = []
  const inLanguage: string[] = []
  const byUrl = new Map<
    string,
    { loc: string; lang: string; hreflang: Record<string, string> }
  >()

  for (const loc of locs) {
    const response = await request.get(sitePath(loc), { maxRedirects: 0 })
    if (response.status() !== 200) {
      other.push(`${loc} responded ${response.status()}`)
      continue
    }

    const html = await response.text()
    if (html.includes('noindex')) {
      other.push(`${loc} contains noindex`)
    }

    const served = await page.evaluate(parseHtml, html)
    if (served.jsonLdError) {
      other.push(`${loc} has invalid JSON-LD: ${served.jsonLdError}`)
    }
    if (!served.title) {
      other.push(`${loc} is missing a title`)
    }
    if (!served.description) {
      other.push(`${loc} is missing a meta description`)
    }
    if (!served.canonical.startsWith('https://')) {
      other.push(`${loc} canonical is not absolute: ${served.canonical}`)
    }
    for (const [name, value] of [
      ['og:title', served.ogTitle],
      ['og:description', served.ogDescription],
      ['og:url', served.ogUrl],
      ['og:image', served.ogImage],
    ] as const) {
      if (!value) {
        other.push(`${loc} is missing ${name}`)
      }
    }
    if (served.ogUrl !== served.canonical) {
      other.push(
        `${loc} og:url ${served.ogUrl} differs from canonical ${served.canonical}`,
      )
    }

    const expectedLocale =
      served.lang === 'pt-BR' ? 'pt_BR' : served.lang === 'en' ? 'en_US' : ''
    const expectedLanguage = expectedLocale ? served.lang : ''
    if (!expectedLocale) {
      other.push(`${loc} has lang="${served.lang}"`)
    } else if (served.ogLocale !== expectedLocale) {
      other.push(`${loc} og:locale is ${served.ogLocale || 'missing'}`)
    }

    if (isPortuguesePost(loc)) {
      if (Object.keys(served.hreflang).length > 0) {
        other.push(`${loc} emits hreflang`)
      }
    } else if (expectedLanguage) {
      if (!served.hreflang[expectedLanguage]) {
        other.push(`${loc} is missing hreflang ${expectedLanguage}`)
      }
      if (!served.hreflang['x-default']) {
        other.push(`${loc} is missing hreflang x-default`)
      }
    }

    for (const value of served.inLanguages) {
      if (value !== expectedLanguage) {
        inLanguage.push(`${loc} inLanguage is "${value}"`)
      }
    }

    byUrl.set(normalizeAbsolute(loc), {
      loc,
      lang: served.lang,
      hreflang: served.hreflang,
    })
  }

  for (const served of byUrl.values()) {
    if (Object.keys(served.hreflang).length === 0) {
      continue
    }
    for (const [lang, href] of Object.entries(served.hreflang)) {
      if (lang === 'x-default') {
        continue
      }
      const target = byUrl.get(normalizeAbsolute(href))
      if (!target) {
        other.push(
          `${served.loc} hreflang ${lang} points outside the sitemap: ${href}`,
        )
        continue
      }
      const back = target.hreflang[served.lang]
      if (!back || normalizeAbsolute(back) !== normalizeAbsolute(served.loc)) {
        other.push(
          `${served.loc} declares ${href}, and that page does not declare ${served.lang} back`,
        )
      }
    }
  }

  expect(other).toEqual([])
  expect(inLanguage).toEqual([])
})

test('noindex routes and english post urls stay out of the sitemap', async ({
  page,
  request,
}) => {
  const locs = await sitemapLocs(page, request)
  const pathnames = locs.map((loc) => new URL(loc).pathname)
  const slug = getNewestBlogPost('seo-consistency').slug

  for (const pathname of [
    '/trilha',
    '/en/trilha',
    '/design-system',
    '/alunos',
    `/en/blog/${slug}`,
  ]) {
    expect(pathnames, pathname).not.toContain(pathname)
  }
})
