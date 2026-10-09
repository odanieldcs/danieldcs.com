'use client'

import { useEffect, useState } from 'react'
import { useUiDictionary } from '@/components/interface-language-provider'
import {
  LoadingBar,
  LoadingStatus,
} from '@/components/layout/loading-indicator'

// Stays up through hydration so the page-in fade does not paint as an empty screen.
const HIDE_AFTER_MS = 200

export function BootLoader() {
  const { navigation } = useUiDictionary()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(false), HIDE_AFTER_MS)
    return () => window.clearTimeout(timeout)
  }, [])

  if (!visible) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 bg-background">
      <LoadingBar phase="loading" className="absolute inset-x-0 top-0" />
      <LoadingStatus
        label={navigation.loading}
        className="absolute right-page bottom-6"
      />
    </div>
  )
}
