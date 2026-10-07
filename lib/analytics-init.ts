import {
  type AnalyticsEvent,
  bindAnalyticsCapture,
  discardAnalyticsQueue,
} from '@/lib/analytics'
import { htmlLang, type InterfaceLanguage } from '@/lib/i18n/types'

function interfaceLanguageFromDocument(): InterfaceLanguage | undefined {
  const lang = document.documentElement.lang
  if (lang === htmlLang.pt) {
    return 'pt'
  }
  if (lang === htmlLang.en) {
    return 'en'
  }
  return undefined
}

export async function initAnalytics(): Promise<void> {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) {
    return
  }

  try {
    // Slim entry + __extensionClasses are PostHog internals; bump posthog-js only in a
    // dedicated task that re-checks pageviews, registered extensions (historyAutocapture,
    // webVitalsAutocapture), dist/web-vitals side import, and lazy chunk size.
    const [{ default: posthog }, { AnalyticsExtensions }] = await Promise.all([
      import('posthog-js/dist/module.slim'),
      import('posthog-js/dist/extension-bundles'),
      import('posthog-js/dist/web-vitals'),
    ])

    posthog.init(key, {
      api_host: 'https://us.i.posthog.com',
      persistence: 'memory',
      capture_pageview: 'history_change',
      capture_pageleave: false,
      autocapture: false,
      capture_dead_clicks: false,
      rageclick: false,
      capture_heatmaps: false,
      capture_performance: {
        web_vitals: true,
        web_vitals_attribution: false,
      },
      capture_exceptions: false,
      disable_session_recording: true,
      disable_surveys: true,
      advanced_disable_flags: true,
      __extensionClasses: {
        historyAutocapture: AnalyticsExtensions.historyAutocapture,
        webVitalsAutocapture: AnalyticsExtensions.webVitalsAutocapture,
      },
      before_send: (captureResult) => {
        if (captureResult?.event !== '$pageview') {
          return captureResult
        }
        const language = interfaceLanguageFromDocument()
        if (!language || captureResult.properties?.language) {
          return captureResult
        }
        return {
          ...captureResult,
          properties: { ...captureResult.properties, language },
        }
      },
      loaded: (client) => {
        const language = interfaceLanguageFromDocument()
        if (language) {
          client.register({ language })
        }
        bindAnalyticsCapture((event: AnalyticsEvent) => {
          client.capture(event.name, event.properties)
        })
      },
    })
  } catch {
    discardAnalyticsQueue()
  }
}
