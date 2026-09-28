import { renderToStaticMarkup } from 'react-dom/server'
import { expect, test } from 'vitest'
import { compileMdxForTest } from './mdx-test-helpers'
import { prepareMdxSource } from './prepare-mdx-source'

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
  const { content } = await compileMdxForTest(fixture)
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

test('renders figure, figcaption, gif images, and tables', async () => {
  const source = `
<figure>
![](/media/posts/example/animation.gif)
<figcaption>

Legenda da figura

</figcaption>
</figure>

| Comando | Descrição |
| --- | --- |
| **pm2 stop <nome>** | Para um processo |
`
  const { content } = await compileMdxForTest(prepareMdxSource(source))
  const html = renderToStaticMarkup(content)

  expect(html).toMatch(/<figure[^>]*class="[^"]*my-content-gap/)
  expect(html).toMatch(/<figcaption[^>]*class="[^"]*text-caption/)
  expect(html).toContain('src="/media/posts/example/animation.gif"')
  expect(html).not.toContain('_next/image')
  expect(html).toMatch(/<table[^>]*class="[^"]*border-collapse/)
  expect(html).toMatch(/<td[^>]*class="[^"]*border-border/)
}, 15_000)

test('renders svg images on a white plate with a native img', async () => {
  const { content } = await compileMdxForTest(
    '![](/media/posts/example/diagram.svg)',
  )
  const html = renderToStaticMarkup(content)

  expect(html).toMatch(/<span[^>]*class="[^"]*bg-white/)
  expect(html).toContain('src="/media/posts/example/diagram.svg"')
  expect(html).not.toContain('_next/image')
}, 15_000)
