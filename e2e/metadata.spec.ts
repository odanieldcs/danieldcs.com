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
  return `${siteUrl}${path}`
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

/** Next.js file-convention icons stay root-relative; the browser resolves them. */
function expectFileConventionIcon(url: string | undefined, name: string) {
  expect(url).toMatch(new RegExp(`^/${name}-[a-z0-9]+\\.png`))
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

test('a blog post follows the title template', async ({ request }) => {
  const post = getNewestBlogPost('metadata.spec')
  const response = await request.get(`/blog/${post.slug}`)

  expect(response.ok()).toBe(true)
  const html = await response.text()
  expect(html).toContain(
    `<title>${post.frontmatter.title} · Daniel Castro</title>`,
  )
  expectBaseMetadata(html)
})
