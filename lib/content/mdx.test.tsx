import { compileMDX } from 'next-mdx-remote/rsc'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, test } from 'vitest'
import { mdxComponents } from './mdx-components'
import { compileMdxForTest } from './mdx-test-helpers'
import { prepareMdxSource } from './prepare-mdx-source'

test('compiles a heading to an h1', async () => {
  const { content } = await compileMDX({ source: '# Hello' })
  const html = renderToStaticMarkup(content)

  expect(html).toContain('<h1>Hello</h1>')
})

test('highlights a ts code fence with Shiki tokens', async () => {
  const { content } = await compileMdxForTest('```ts\nconst answer = 42\n```')
  const html = renderToStaticMarkup(content)

  expect(html).toContain('shiki')
  expect(html).toContain('--shiki-light:')
  expect(html).not.toMatch(/\bcolor:#/)
  expect(html).toContain('data-language="ts"')
  expect(html).toContain('data-line-number="1"')
  expect(html).toContain('data-line-numbers="true"')
}, 15_000)

test('applies meta highlight class from fence meta {1}', async () => {
  const { content } = await compileMdxForTest(
    '```ts {1}\nconst first = 1\nconst second = 2\n```',
  )
  const html = renderToStaticMarkup(content)

  expect(html).toContain('data-highlight="true"')
}, 15_000)

test.each(['ts', 'tsx', 'bash', 'json'] as const)(
  'compiles a %s code fence without error',
  async (language) => {
    const source = `\`\`\`${language}\n{}\n\`\`\``
    await expect(compileMdxForTest(source)).resolves.toBeDefined()
  },
  15_000,
)

test('prepareMdxSource allows compiling PM2 placeholders and figure markup', async () => {
  const source = `
Limite com --lines <quantidade>.

<figure>

![](/media/posts/como-usar-pm2-com-node-js-em-producao/pm2-output-start-cluster-1024x154.png)

<figcaption>

Resultado ao iniciar o processo com 4 CPUs

</figcaption>

</figure>
`
  const { content } = await compileMdxForTest(
    prepareMdxSource(source),
    mdxComponents,
  )
  const html = renderToStaticMarkup(content)

  expect(html).toContain('&lt;quantidade&gt;')
  expect(html).toMatch(/<figure[^>]*class="[^"]*my-content-gap/)
  expect(html).toMatch(/<figcaption[^>]*class="[^"]*text-caption/)
}, 15_000)
