import { compileMDX } from 'next-mdx-remote/rsc'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, test } from 'vitest'
import { shikiRehypePlugin } from './mdx'

async function compileHighlighted(source: string) {
  return compileMDX({
    source,
    options: {
      mdxOptions: {
        rehypePlugins: [shikiRehypePlugin],
      },
    },
  })
}

test('compiles a heading to an h1', async () => {
  const { content } = await compileMDX({ source: '# Hello' })
  const html = renderToStaticMarkup(content)

  expect(html).toContain('<h1>Hello</h1>')
})

test('highlights a ts code fence with Shiki tokens', async () => {
  const { content } = await compileHighlighted('```ts\nconst answer = 42\n```')
  const html = renderToStaticMarkup(content)

  expect(html).toContain('shiki')
  expect(html).toMatch(/style=/)
  expect(html).toContain('data-language="ts"')
  expect(html).toContain('data-line-number="1"')
  expect(html).toContain('data-line-numbers="true"')
}, 15_000)

test('applies meta highlight class from fence meta {1}', async () => {
  const { content } = await compileHighlighted(
    '```ts {1}\nconst first = 1\nconst second = 2\n```',
  )
  const html = renderToStaticMarkup(content)

  expect(html).toContain('data-highlight="true"')
}, 15_000)

test.each(['ts', 'tsx', 'bash', 'json'] as const)(
  'compiles a %s code fence without error',
  async (language) => {
    const source = `\`\`\`${language}\n{}\n\`\`\``
    await expect(compileHighlighted(source)).resolves.toBeDefined()
  },
  15_000,
)
