import { cleanup, render } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { BootProgress } from './boot-progress'

afterEach(() => {
  cleanup()
  delete document.documentElement.dataset.loaded
  Reflect.deleteProperty(document, 'readyState')
})

test('marks the document loaded when it is already complete', () => {
  Object.defineProperty(document, 'readyState', {
    configurable: true,
    get: () => 'complete',
  })

  render(<BootProgress />)

  expect(document.documentElement.dataset.loaded).toBe('')
})

test('marks the document loaded when the window load event fires', () => {
  Object.defineProperty(document, 'readyState', {
    configurable: true,
    get: () => 'loading',
  })

  const pending = render(<BootProgress />)

  expect(document.documentElement.dataset.loaded).toBeUndefined()
  pending.unmount()

  window.dispatchEvent(new Event('load'))
  expect(document.documentElement.dataset.loaded).toBeUndefined()

  render(<BootProgress />)
  window.dispatchEvent(new Event('load'))
  expect(document.documentElement.dataset.loaded).toBe('')
})
