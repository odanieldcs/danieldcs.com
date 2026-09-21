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

const paletteOrTypeClasses =
  /class="[^"]*(?:text-|bg-|font-|leading-|tracking-|p-|m-|gap-)/

test('renders a mixed MDX fixture with semantic HTML and no design-system classes', async () => {
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

  expect(html).toContain('<h1>Heading</h1>')
  expect(html).toContain('<p>')
  expect(html).toContain('<a href="/blog/hello-world">internal</a>')
  expect(html).toContain(
    '<a href="https://example.com" target="_blank" rel="noopener noreferrer">external</a>',
  )
  expect(html).toContain('<img')
  expect(html).toContain('hello-world.png')
  expect(html).toContain('alt="Cover"')
  expect(html).toContain('width="800"')
  expect(html).toContain('height="450"')
  expect(html).toContain('<ul>')
  expect(html).toContain('<li>first item</li>')
  expect(html).toContain('<blockquote>')
  expect(html).toContain('shiki')
  expect(html).toMatch(/style=/)
  expect(html).not.toMatch(paletteOrTypeClasses)
}, 15_000)
