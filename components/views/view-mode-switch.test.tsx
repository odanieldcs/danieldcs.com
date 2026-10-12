import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { ViewModeSwitch } from './view-mode-switch'

const options = [
  { id: 'list' as const, label: 'Lista', icon: <span>list</span> },
  { id: 'grid' as const, label: 'Grade', icon: <span>grid</span> },
]

afterEach(() => {
  cleanup()
})

test('link mode marks the committed view with aria-current', () => {
  render(
    <ViewModeSwitch
      ariaLabel="Formato"
      view="list"
      idPrefix="blog-view"
      hrefFor={(id) => (id === 'list' ? '/blog' : '/blog?view=grid')}
      options={options}
    />,
  )

  const list = screen.getByRole('link', { name: 'Lista' })
  const grid = screen.getByRole('link', { name: 'Grade' })

  expect(list.getAttribute('aria-current')).toBe('page')
  expect(grid.hasAttribute('aria-current')).toBe(false)
  expect(list.hasAttribute('aria-pressed')).toBe(false)
  expect(grid.hasAttribute('aria-pressed')).toBe(false)
  expect(list.className.split(/\s+/)).toContain('text-foreground')
})

test('button mode keeps aria-pressed and omits aria-current', () => {
  render(
    <ViewModeSwitch
      ariaLabel="Formato"
      view="grid"
      idPrefix="community-view"
      options={options}
    />,
  )

  const list = screen.getByRole('button', { name: 'Lista' })
  const grid = screen.getByRole('button', { name: 'Grade' })

  expect(grid.getAttribute('aria-pressed')).toBe('true')
  expect(list.getAttribute('aria-pressed')).toBe('false')
  expect(list.hasAttribute('aria-current')).toBe(false)
  expect(grid.hasAttribute('aria-current')).toBe(false)
})
