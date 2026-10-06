import { isAnalyticsEnabled } from '@/lib/analytics'
import { scheduleOnLoad } from '@/lib/analytics-schedule'

function scheduleAnalyticsInit(): void {
  if (!isAnalyticsEnabled()) {
    return
  }

  scheduleOnLoad(() => {
    void import('@/lib/analytics-init').then((module) => module.initAnalytics())
  })
}

scheduleAnalyticsInit()
