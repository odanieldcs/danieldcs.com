'use client'

import { RouteErrorBoundary } from '@/components/route-error-boundary'

export default function PtRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <RouteErrorBoundary error={error} reset={reset} language="pt" />
}
