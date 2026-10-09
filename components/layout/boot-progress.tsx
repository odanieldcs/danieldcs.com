'use client'

import { useEffect } from 'react'

export function BootProgress() {
  useEffect(() => {
    const markLoaded = () => {
      document.documentElement.dataset.loaded = ''
    }

    if (document.readyState === 'complete') {
      markLoaded()
      return
    }

    window.addEventListener('load', markLoaded, { once: true })
    return () => window.removeEventListener('load', markLoaded)
  }, [])

  return null
}
