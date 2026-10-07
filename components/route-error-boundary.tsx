'use client'

import { useEffect } from 'react'
import { ErrorView } from '@/components/error-view'
import { captureError } from '@/lib/analytics'
import type { InterfaceLanguage } from '@/lib/i18n/types'

export function RouteErrorBoundary({
  error,
  reset,
  language,
}: {
  error: Error & { digest?: string }
  reset: () => void
  language: InterfaceLanguage
}) {
  useEffect(() => {
    captureError(error, { boundary: 'route', digest: error.digest })
  }, [error])

  return <ErrorView language={language} reset={reset} />
}
