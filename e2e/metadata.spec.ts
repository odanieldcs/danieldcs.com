import { expect, test } from '@playwright/test'
import { getNewestBlogPost } from './helpers/posts'

const pages = [
  { path: '/', title: 'Daniel Castro' },
  { path: '/about', title: 'Sobre · Daniel Castro' },
  { path: '/blog', title: 'Blog · Daniel Castro' },
  { path: '/community', title: 'Comunidade · Daniel Castro' },
]

function expectBaseMetadata(html: string) {
  expect(html).toContain(
    '<meta property="og:site_name" content="Daniel Castro"',
  )
  expect(html).toContain('<meta property="og:type" content="website"')
  expect(html).toContain('<meta property="og:locale" content="pt_BR"')
  expect(html).toContain(
    '<meta name="twitter:card" content="summary_large_image"',
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
