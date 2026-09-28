import { expect, test } from 'vitest'
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
  const source = 'Use --lines <quantidade> no comando.'
  const once = prepareMdxSource(source)
  expect(prepareMdxSource(once)).toBe(once)
})
