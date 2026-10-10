import { cleanup, render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, expect, test } from 'vitest'
import { PageEnter, willAnimateNextEnter } from './page-enter'

afterEach(() => {
  cleanup()
})

test('animates only on mounts after the first one in the module', () => {
  expect(willAnimateNextEnter()).toBe(false)

  const html = renderToString(<PageEnter>documento</PageEnter>)
  expect(html).not.toContain('animate-page-in')
  expect(willAnimateNextEnter()).toBe(false)

  const first = render(<PageEnter>home</PageEnter>)
  const firstEnter = first.container.querySelector('[data-page-enter]')
  expect(firstEnter).not.toBeNull()
  expect(firstEnter?.className ?? '').not.toContain('animate-page-in')
  expect(willAnimateNextEnter()).toBe(true)
  first.unmount()

  const second = render(<PageEnter>about</PageEnter>)
  const secondEnter = second.container.querySelector('[data-page-enter]')
  expect(secondEnter?.className).toContain('motion-safe:animate-page-in')
})
