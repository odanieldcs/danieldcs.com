import { compileMDX } from 'next-mdx-remote/rsc'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, test } from 'vitest'
import { shikiRehypePlugin } from './mdx'
import { mdxComponents } from './mdx-components'

const fixture = `
# Heading

A paragraph with an [internal](/blog/hello-world) and [external](https://example.com) link.

![Cover](/media/posts/hello-world.png)

- first item

> quoted

\`\`\`ts
const answer = 42
\`\`\`
`

test('renders a mixed MDX fixture with semantic HTML and styled links', async () => {
  const { content } = await compileMDX({
    source: fixture,
    components: mdxComponents,
    options: {
      mdxOptions: {
        rehypePlugins: [shikiRehypePlugin],
      },
    },
  })
  const html = renderToStaticMarkup(content)

  expect(html).toMatch(/<h1[^>]*class="[^"]*text-h1[^"]*"[^>]*>Heading<\/h1>/)
  expect(html).toMatch(/<p[^>]*class="[^"]*text-body/)
  expect(html).toContain('href="/blog/hello-world"')
  expect(html).toContain('href="https://example.com"')
  expect(html).toContain('target="_blank"')
  expect(html).toContain('rel="noopener noreferrer"')
  const internalAnchor = html.match(/<a[^>]*href="\/blog\/hello-world"[^>]*>/)
  const externalAnchor = html.match(/<a[^>]*href="https:\/\/example.com"[^>]*>/)
  expect(internalAnchor?.[0]).toContain('text-link')
  expect(externalAnchor?.[0]).toContain('text-link')
  expect(html).toContain('>internal</a>')
  expect(html).toContain('>external</a>')
  expect(html).toContain('<img')
  expect(html).toContain('hello-world.png')
  expect(html).toContain('alt="Cover"')
  expect(html).toContain('width="800"')
  expect(html).toContain('height="450"')
  expect(html).toMatch(/<img[^>]*class="[^"]*w-full[^"]*rounded-md/)
  expect(html).toMatch(/<ul[^>]*class="[^"]*list-disc/)
  expect(html).toMatch(
    /<li[^>]*class="[^"]*text-body[^"]*"[^>]*>first item<\/li>/,
  )
  expect(html).toMatch(/<blockquote[^>]*class="[^"]*text-muted/)
  expect(html).toContain('shiki')
  expect(html).toMatch(/style=/)
  expect(html).toMatch(
    /<pre[^>]*class="[^"]*my-content-gap[^"]*overflow-x-auto/,
  )
  expect(html).toMatch(/<code class="block text-code"/)
}, 15_000)
