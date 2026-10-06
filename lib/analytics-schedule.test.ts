import { afterEach, expect, test, vi } from 'vitest'
import { scheduleOnLoad } from './analytics-schedule'

const originalReadyState = Object.getOwnPropertyDescriptor(
  document,
  'readyState',
)
const originalRequestIdleCallback = window.requestIdleCallback

afterEach(() => {
  if (originalReadyState) {
    Object.defineProperty(document, 'readyState', originalReadyState)
  }
  if (originalRequestIdleCallback) {
    window.requestIdleCallback = originalRequestIdleCallback
  } else {
    Reflect.deleteProperty(window, 'requestIdleCallback')
  }
  vi.restoreAllMocks()
})

test('runs once via requestIdleCallback when readyState is complete', () => {
  Object.defineProperty(document, 'readyState', {
    configurable: true,
    get: () => 'complete',
  })

  const run = vi.fn()
  window.requestIdleCallback = (callback) => {
    callback({} as IdleDeadline)
    return 0
  }
  const addLoadListener = vi.spyOn(window, 'addEventListener')

  scheduleOnLoad(run)

  expect(run).toHaveBeenCalledOnce()
  expect(addLoadListener).not.toHaveBeenCalledWith(
    'load',
    expect.any(Function),
    expect.anything(),
  )
})

test('runs once on load when readyState is loading', () => {
  Object.defineProperty(document, 'readyState', {
    configurable: true,
    get: () => 'loading',
  })

  const run = vi.fn()
  window.requestIdleCallback = (callback) => {
    callback({} as IdleDeadline)
    return 0
  }

  scheduleOnLoad(run)

  expect(run).not.toHaveBeenCalled()

  window.dispatchEvent(new Event('load'))
  expect(run).toHaveBeenCalledOnce()

  window.dispatchEvent(new Event('load'))
  expect(run).toHaveBeenCalledOnce()
})

test('runs immediately when requestIdleCallback is unavailable', () => {
  Object.defineProperty(document, 'readyState', {
    configurable: true,
    get: () => 'complete',
  })

  Reflect.deleteProperty(window, 'requestIdleCallback')

  const run = vi.fn()
  scheduleOnLoad(run)

  expect(run).toHaveBeenCalledOnce()
})
