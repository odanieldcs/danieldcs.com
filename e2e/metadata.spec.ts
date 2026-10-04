import { expect, test } from '@playwright/test'
import { siteUrl } from '@/lib/site'
import { getNewestBlogPost } from './helpers/posts'

type Locale = 'pt_BR' | 'en_US'

const hreflang = {
  'pt-BR': '/',
  en: '/en',
  'x-default': '/',
} as const

const pages = [
  {
    path: '/',
    title: 'Daniel Castro',
    description:
      'Construindo produtos de software e correndo longas distâncias.',
    ogTitle: 'Daniel Castro',
    locale: 'pt_BR' as const,
    alternateLocale: 'en_US' as const,
    canonical: '/',
    hreflang,
  },
  {
    path: '/en',
    title: 'Daniel Castro',
    description: 'Building software products and running long distances.',
    ogTitle: 'Daniel Castro',
    locale: 'en_US' as const,
    alternateLocale: 'pt_BR' as const,
    canonical: '/en',
    hreflang,
  },
  {
    path: '/blog',
    title: 'Blog · Daniel Castro',
    description: 'Artigos e notas de engenharia de Daniel Castro.',
    ogTitle: 'Blog',
    locale: 'pt_BR' as const,
    alternateLocale: 'en_US' as const,
    canonical: '/blog',
    hreflang: {
      'pt-BR': '/blog',
      en: '/en/blog',
      'x-default': '/blog',
    },
  },
  {
    path: '/en/blog',
    title: 'Writing · Daniel Castro',
    description: 'Articles and engineering notes by Daniel Castro.',
    ogTitle: 'Writing',
    locale: 'en_US' as const,
    alternateLocale: 'pt_BR' as const,
    canonical: '/en/blog',
    hreflang: {
      'pt-BR': '/blog',
      en: '/en/blog',
      'x-default': '/blog',
    },
  },
  {
    path: '/community',
    title: 'Comunidade · Daniel Castro',
    description: 'Palestras, workshops e encontros de Daniel Castro.',
    ogTitle: 'Comunidade',
    locale: 'pt_BR' as const,
    alternateLocale: 'en_US' as const,
    canonical: '/community',
    hreflang: {
      'pt-BR': '/community',
      en: '/en/community',
      'x-default': '/community',
    },
  },
  {
    path: '/en/community',
    title: 'Community · Daniel Castro',
    description: 'Talks, workshops, and gatherings by Daniel Castro.',
    ogTitle: 'Community',
    locale: 'en_US' as const,
    alternateLocale: 'pt_BR' as const,
    canonical: '/en/community',
    hreflang: {
      'pt-BR': '/community',
      en: '/en/community',
      'x-default': '/community',
    },
  },
  {
    path: '/about',
    title: 'Sobre · Daniel Castro',
    description: 'Trajetória, repertório e contato de Daniel Castro.',
    ogTitle: 'Sobre',
    locale: 'pt_BR' as const,
    alternateLocale: 'en_US' as const,
    canonical: '/about',
    hreflang: {
      'pt-BR': '/about',
      en: '/en/about',
      'x-default': '/about',
    },
  },
  {
    path: '/en/about',
    title: 'About · Daniel Castro',
    description: 'Path, repertoire, and contact for Daniel Castro.',
    ogTitle: 'About',
    locale: 'en_US' as const,
    alternateLocale: 'pt_BR' as const,
    canonical: '/en/about',
    hreflang: {
      'pt-BR': '/about',
      en: '/en/about',
      'x-default': '/about',
    },
  },
]

function tagAttr(html: string, tag: RegExp, attr: string) {
  const element = html.match(tag)?.[0]
  return element?.match(new RegExp(`${attr}="([^"]+)"`))?.[1]
}

function expectAbsoluteSiteUrl(url: string | undefined) {
  expect(url?.startsWith(`${siteUrl}/`)).toBe(true)
}

function absoluteUrl(path: string) {
  return path === '/' ? siteUrl : `${siteUrl}${path}`
}

function jsonLdScripts(html: string): unknown[] {
  const scripts =
    html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) ??
    []

  return scripts.map((block) => {
    const json = block.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
    )?.[1]
    return JSON.parse(json ?? '{}')
  })
}

function graphNode(
  document: { '@graph'?: Array<Record<string, unknown>> } | undefined,
  type: string,
): Record<string, unknown> | undefined {
  return document?.['@graph']?.find((node) => node['@type'] === type)
}

function linkTags(html: string) {
  return html.match(/<link\b[^>]*>/g) ?? []
}

function canonicalHref(html: string) {
  const tag = linkTags(html).find((entry) => /rel="canonical"/.test(entry))
  return tag?.match(/href="([^"]+)"/)?.[1]
}

function hreflangMap(html: string) {
  const map: Record<string, string> = {}

  for (const tag of linkTags(html)) {
    if (!/rel="alternate"/.test(tag)) {
      continue
    }

    const locale = tag.match(/\b(?:hrefLang|hreflang)="([^"]+)"/)?.[1]
    const href = tag.match(/href="([^"]+)"/)?.[1]

    if (locale && href) {
      map[locale] = href
    }
  }

  return map
}

/** Next.js file-convention icons stay relative to the route segment. */
function expectFileConventionIcon(url: string | undefined, name: string) {
  expect(url).toMatch(new RegExp(`^(?:/en)?/${name}-[a-z0-9]+\\.png`))
}

function expectBaseMetadata(html: string, locale: Locale = 'pt_BR') {
  expect(html).toContain(
    '<meta property="og:site_name" content="Daniel Castro"',
  )
  expect(html).toContain('<meta property="og:type" content="website"')
  expect(html).toContain(`<meta property="og:locale" content="${locale}"`)
  expect(html).toContain(
    '<meta name="twitter:card" content="summary_large_image"',
  )
  expectFileConventionIcon(
    tagAttr(html, /<link\b[^>]*rel="icon"[^>]*>/, 'href'),
    'icon',
  )
  expectFileConventionIcon(
    tagAttr(html, /<link\b[^>]*rel="apple-touch-icon"[^>]*>/, 'href'),
    'apple-icon',
  )
  expectAbsoluteSiteUrl(
    tagAttr(html, /<meta\b[^>]*property="og:image"[^>]*>/, 'content'),
  )
  expectAbsoluteSiteUrl(
    tagAttr(html, /<meta\b[^>]*name="twitter:image"[^>]*>/, 'content'),
  )
}

for (const page of pages) {
  test(`${page.path} serves localized metadata, canonical, and hreflang`, async ({
    request,
  }) => {
    const response = await request.get(page.path)

    expect(response.ok()).toBe(true)
    const html = await response.text()
    expect(html).toContain(`<title>${page.title}</title>`)
    expect(html).toContain(
      `<meta name="description" content="${page.description}"`,
    )
    expect(html).toContain(
      `<meta property="og:title" content="${page.ogTitle}"`,
    )
    expect(html).toContain(
      `<meta property="og:description" content="${page.description}"`,
    )
    expect(html).toContain(
      `<meta property="og:locale:alternate" content="${page.alternateLocale}"`,
    )
    expect(canonicalHref(html)).toBe(absoluteUrl(page.canonical))
    expect(
      tagAttr(html, /<meta\b[^>]*property="og:url"[^>]*>/, 'content'),
    ).toBe(absoluteUrl(page.canonical))
    expect(hreflangMap(html)).toEqual(
      Object.fromEntries(
        Object.entries(page.hreflang).map(([locale, path]) => [
          locale,
          absoluteUrl(path),
        ]),
      ),
    )
    expectBaseMetadata(html, page.locale)
  })
}

function expectPostMetadata(html: string, slug: string, title: string) {
  const canonicalUrl = absoluteUrl(`/blog/${slug}`)

  expect(html).toContain(`<title>${title} · Daniel Castro</title>`)
  expect(canonicalHref(html)).toBe(canonicalUrl)
  expect(tagAttr(html, /<meta\b[^>]*property="og:url"[^>]*>/, 'content')).toBe(
    canonicalUrl,
  )
  expect(html).toContain('<meta property="og:type" content="article"')
  expect(html).toContain(
    '<meta property="og:site_name" content="Daniel Castro"',
  )
  expect(html).toContain('<meta property="og:locale" content="pt_BR"')
  expect(html).toContain(
    '<meta name="twitter:card" content="summary_large_image"',
  )
  expectAbsoluteSiteUrl(
    tagAttr(html, /<meta\b[^>]*property="og:image"[^>]*>/, 'content'),
  )
  expectAbsoluteSiteUrl(
    tagAttr(html, /<meta\b[^>]*name="twitter:image"[^>]*>/, 'content'),
  )
  expect(hreflangMap(html)).toEqual({})
}

const noindexPages = [
  {
    path: '/trilha',
    title: 'Trilha · Daniel Castro',
    description:
      'Guiado por quem aplica no dia a dia, em engenharia de software.',
  },
  {
    path: '/en/trilha',
    title: 'Trilha · Daniel Castro',
    description:
      'Guided by someone who applies it every day, in software engineering.',
  },
  {
    path: '/design-system',
    title: 'Design System (internal) · Daniel Castro',
  },
]

for (const page of noindexPages) {
  test(`${page.path} is noindex and emits no hreflang`, async ({ request }) => {
    const response = await request.get(page.path)

    expect(response.ok()).toBe(true)
    const html = await response.text()
    expect(html).toContain(`<title>${page.title}</title>`)
    expect(html).toContain('<meta name="robots" content="noindex, nofollow"')
    expect(hreflangMap(html)).toEqual({})
    expect(canonicalHref(html)).toBe(absoluteUrl(page.path))

    if ('description' in page && page.description) {
      expect(html).toContain(
        `<meta name="description" content="${page.description}"`,
      )
    }
  })
}

test('blog grid view keeps the path canonical', async ({ request }) => {
  const html = await (await request.get('/blog?view=grid')).text()

  expect(canonicalHref(html)).toBe(absoluteUrl('/blog'))
  expect(hreflangMap(html).en).toBe(absoluteUrl('/en/blog'))
})

test('blog page 2 canonical includes the page and not the view', async ({
  request,
}) => {
  const html = await (await request.get('/blog?page=2&view=grid')).text()
  const languages = hreflangMap(html)

  expect(canonicalHref(html)).toBe(absoluteUrl('/blog?page=2'))
  expect(languages['pt-BR']).toBe(absoluteUrl('/blog?page=2'))
  expect(languages.en).toBe(absoluteUrl('/en/blog?page=2'))
  expect(languages['x-default']).toBe(absoluteUrl('/blog?page=2'))
  expect(JSON.stringify(languages)).not.toContain('view=')
})

test('english blog page 2 points hreflang back at the portuguese page', async ({
  request,
}) => {
  const html = await (await request.get('/en/blog?page=2')).text()
  const languages = hreflangMap(html)

  expect(html).toContain('<title>Writing · Daniel Castro</title>')
  expect(canonicalHref(html)).toBe(absoluteUrl('/en/blog?page=2'))
  expect(languages['pt-BR']).toBe(absoluteUrl('/blog?page=2'))
  expect(languages.en).toBe(absoluteUrl('/en/blog?page=2'))
  expect(languages['x-default']).toBe(absoluteUrl('/blog?page=2'))
})

test('a blog post exposes article metadata and a self canonical', async ({
  request,
}) => {
  const post = getNewestBlogPost('metadata.spec')
  const response = await request.get(`/blog/${post.slug}`)

  expect(response.ok()).toBe(true)
  expectPostMetadata(await response.text(), post.slug, post.frontmatter.title)
})

test('the /en blog post canonicalizes to the PT url with no hreflang', async ({
  request,
}) => {
  const post = getNewestBlogPost('metadata.spec')
  const response = await request.get(`/en/blog/${post.slug}`)

  expect(response.ok()).toBe(true)
  expectPostMetadata(await response.text(), post.slug, post.frontmatter.title)
})

test('home pages emit WebSite and Person JSON-LD with stable ids', async ({
  request,
}) => {
  for (const [path, inLanguage] of [
    ['/', 'pt-BR'],
    ['/en', 'en'],
  ] as const) {
    const html = await (await request.get(path)).text()
    const document = jsonLdScripts(html)[0] as
      | { '@graph': Array<Record<string, unknown>> }
      | undefined

    expect(document?.['@graph']).toHaveLength(2)
    const person = graphNode(document, 'Person')
    const website = graphNode(document, 'WebSite')

    expect(person?.['@id']).toBe(`${siteUrl}/#person`)
    expect(website?.['@id']).toBe(`${siteUrl}/#website`)
    expect(website?.inLanguage).toBe(inLanguage)
    expect(website?.publisher).toEqual({ '@id': `${siteUrl}/#person` })
  }
})

test('blog posts emit BlogPosting JSON-LD with PT canonical url', async ({
  request,
}) => {
  const post = getNewestBlogPost('metadata.spec-jsonld')
  const canonicalUrl = absoluteUrl(`/blog/${post.slug}`)

  for (const path of [`/blog/${post.slug}`, `/en/blog/${post.slug}`] as const) {
    const html = await (await request.get(path)).text()
    const document = jsonLdScripts(html)[0] as
      | { '@graph': Array<Record<string, unknown>> }
      | undefined
    const posting = graphNode(document, 'BlogPosting')

    expect(posting?.url).toBe(canonicalUrl)
    expect(posting?.mainEntityOfPage).toBe(canonicalUrl)
    expect(posting?.author).toEqual({ '@id': `${siteUrl}/#person` })
    expect(posting?.headline).toBe(post.frontmatter.title)
  }
})

test('about pages emit AboutPage JSON-LD with stable Person @id', async ({
  request,
}) => {
  for (const [path, inLanguage, canonicalPath] of [
    ['/about', 'pt-BR', '/about'],
    ['/en/about', 'en', '/en/about'],
  ] as const) {
    const html = await (await request.get(path)).text()
    const document = jsonLdScripts(html)[0] as
      | { '@graph': Array<Record<string, unknown>> }
      | undefined

    expect(document?.['@graph']).toHaveLength(2)
    const person = graphNode(document, 'Person')
    const page = graphNode(document, 'AboutPage')

    expect(person?.['@id']).toBe(`${siteUrl}/#person`)
    expect(page?.url).toBe(absoluteUrl(canonicalPath))
    expect(page?.inLanguage).toBe(inLanguage)
    expect(page?.isPartOf).toEqual({ '@id': `${siteUrl}/#website` })
    expect(page?.about).toEqual({ '@id': `${siteUrl}/#person` })
  }
})

test('excluded routes do not emit JSON-LD', async ({ request }) => {
  for (const path of [
    '/trilha',
    '/en/trilha',
    '/design-system',
    '/alunos',
    '/community',
    '/en/community',
  ] as const) {
    const html = await (await request.get(path)).text()
    expect(jsonLdScripts(html)).toEqual([])
  }
})
