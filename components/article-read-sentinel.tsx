'use client'

import { useEffect, useRef } from 'react'
import { isAnalyticsEnabled, track } from '@/lib/analytics'
import type { InterfaceLanguage } from '@/lib/i18n/types'

export function ArticleReadSentinel({
  slug,
  language,
}: {
  slug: string
  language: InterfaceLanguage
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isAnalyticsEnabled()) {
      return
    }

    const element = ref.current
    if (!element) {
      return
    }

    let fired = false
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || fired) {
        return
      }
      fired = true
      track({ name: 'article_read', properties: { slug, language } })
      observer.disconnect()
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [slug, language])

  return <div ref={ref} aria-hidden="true" className="h-0" />
}
