import { compileMDX } from 'next-mdx-remote/rsc'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, test } from 'vitest'

test('compiles a heading to an h1', async () => {
  const { content } = await compileMDX({ source: '# Hello' })
  const html = renderToStaticMarkup(content)

  expect(html).toContain('<h1>Hello</h1>')
})
