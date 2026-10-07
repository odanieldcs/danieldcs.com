import { cleanup, render, waitFor } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { RouteErrorBoundary } from './route-error-boundary'

const captureError = vi.fn()

vi.mock('@/lib/analytics', () => ({
  captureError: (...args: unknown[]) => captureError(...args),
}))

afterEach(() => {
  cleanup()
  captureError.mockClear()
})

test.each(['pt', 'en'] as const)(
  'captures route errors once for language=%s',
  async (language) => {
    const error = Object.assign(new Error('route fail'), { digest: 'digest-1' })

    render(
      <RouteErrorBoundary error={error} reset={() => {}} language={language} />,
    )

    await waitFor(() => {
      expect(captureError).toHaveBeenCalledOnce()
    })
    expect(captureError.mock.calls[0]?.[0]).toBe(error)
    expect(captureError.mock.calls[0]?.[1]).toEqual({
      boundary: 'route',
      digest: 'digest-1',
    })
  },
)
