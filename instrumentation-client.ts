import { isAnalyticsEnabled } from '@/lib/analytics'
import { registerClickTracking } from '@/lib/analytics-click'
import { scheduleOnLoad } from '@/lib/analytics-schedule'

function scheduleAnalyticsInit(): void {
  if (!isAnalyticsEnabled()) {
    return
  }

  registerClickTracking()

  scheduleOnLoad(() => {
    void import('@/lib/analytics-init').then((module) => module.initAnalytics())
  })
}

scheduleAnalyticsInit()
