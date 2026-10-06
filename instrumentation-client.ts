import { isAnalyticsEnabled } from '@/lib/analytics'

function scheduleAnalyticsInit(): void {
  if (!isAnalyticsEnabled()) {
    return
  }

  const runInit = () => {
    void import('@/lib/analytics-init').then((module) => module.initAnalytics())
  }

  window.addEventListener('load', () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(runInit)
    } else {
      runInit()
    }
  })
}

scheduleAnalyticsInit()
