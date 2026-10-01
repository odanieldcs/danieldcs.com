import { expect, test } from '@playwright/test'
import { siteUrl } from '@/lib/site'
import { getNewestBlogPost } from './helpers/posts'

const pages = [
  { path: '/', title: 'Daniel Castro' },
  { path: '/about', title: 'Sobre · Daniel Castro' },
  { path: '/blog', title: 'Blog · Daniel Castro' },
  { path: '/community', title: 'Comunidade · Daniel Castro' },
]

function tagAttr(html: string, tag: RegExp, attr: string) {
  const element = html.match(tag)?.[0]
  return element?.match(new RegExp(`${attr}="([^"]+)"`))?.[1]
}

function expectAbsoluteSiteUrl(url: string | undefined) {
  expect(url?.startsWith(`${siteUrl}/`)).toBe(true)
}

/** Next.js file-convention icons stay root-relative; the browser resolves them. */
function expectFileConventionIcon(url: string | undefined, name: string) {
  expect(url).toMatch(new RegExp(`^/${name}-[a-z0-9]+\\.png`))
}

function expectBaseMetadata(html: string) {
  expect(html).toContain(
    '<meta property="og:site_name" content="Daniel Castro"',
  )
  expect(html).toContain('<meta property="og:type" content="website"')
  expect(html).toContain('<meta property="og:locale" content="pt_BR"')
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

for (const { path, title } of pages) {
  test(`${path} serves the title and the base og/twitter tags`, async ({
    request,
  }) => {
    const response = await request.get(path)

    expect(response.ok()).toBe(true)
    const html = await response.text()
    expect(html).toContain(`<title>${title}</title>`)
    expectBaseMetadata(html)
  })
}

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
