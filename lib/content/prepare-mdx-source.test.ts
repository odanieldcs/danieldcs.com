import { renderToStaticMarkup } from 'react-dom/server'
import { expect, test } from 'vitest'
import { compileMdxForTest } from './mdx-test-helpers'
import { prepareMdxSource } from './prepare-mdx-source'

test('escapes placeholder tags in prose', () => {
  const source = 'Use --lines <quantidade> no comando.'
  expect(prepareMdxSource(source)).toBe(
    'Use --lines \\<quantidade> no comando.',
  )
})

test('escapes less-than outside tags in prose', () => {
  expect(prepareMdxSource('Emoji de coração <3')).toBe('Emoji de coração \\<3')
})

test('preserves figure and figcaption tags', () => {
  const source = `<figure>
![](/media/example.png)
<figcaption>

Legenda

</figcaption>
</figure>`
  expect(prepareMdxSource(source)).toBe(source)
})

test('does not escape angle brackets inside fenced code', () => {
  const source = '```bash\ndocker stop <ID ou nome>\n```'
  expect(prepareMdxSource(source)).toBe(source)
})

test('does not escape angle brackets inside inline code', () => {
  const source = 'Use `pm2 logs <nome>` para ver os logs.'
  expect(prepareMdxSource(source)).toBe(source)
})

test('is idempotent when run twice', () => {
  const source = 'Use --lines <quantidade> e **dark:{classe}** no comando.'
  const once = prepareMdxSource(source)
  expect(prepareMdxSource(once)).toBe(once)
})

test('escapes curly braces in prose', () => {
  expect(
    prepareMdxSource('| lg | 1024px | @media (min-width: 1024px) { … } |'),
  ).toBe('| lg | 1024px | @media (min-width: 1024px) \\{ … \\} |')
  expect(
    prepareMdxSource('Use o modificador **dark:{classe}** no Tailwind.'),
  ).toBe('Use o modificador **dark:\\{classe\\}** no Tailwind.')
})

test('does not escape braces inside fenced code or fence meta', () => {
  const jsxFence =
    '```jsx\nexport function Card({ title }) {\n  return null\n}\n```'
  expect(prepareMdxSource(jsxFence)).toBe(jsxFence)
  expect(prepareMdxSource('```ts {1}\nconst x = 1\n```')).toBe(
    '```ts {1}\nconst x = 1\n```',
  )
})

test('does not escape braces inside inline code', () => {
  expect(prepareMdxSource('Use `{props.title}` no JSX.')).toBe(
    'Use `{props.title}` no JSX.',
  )
})

test('escapes Card and braces through compileMDX', async () => {
  const source = prepareMdxSource(`
Use <Card /> aqui.

Modificador **dark:{classe}**.
`)
  const { content } = await compileMdxForTest(source)
  const html = renderToStaticMarkup(content)
  expect(html).toContain('&lt;Card /&gt;')
  expect(html).toContain('dark:{classe}')
}, 15_000)
