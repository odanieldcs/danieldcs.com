import type { InterfaceLanguage } from '@/lib/i18n/types'

export const CTA_KINDS = [
  'nav_item',
  'home_about',
  'post_card',
  'linkedin_experience',
  'contact_email',
  'language_switch',
] as const

export type CtaKind = (typeof CTA_KINDS)[number]

export const CTA_LOCATIONS = [
  'header',
  'footer',
  'home',
  'blog',
  'about',
] as const

export type CtaLocation = (typeof CTA_LOCATIONS)[number]

export const LINK_SOURCE_VALUES = [
  'post',
  'footer',
  'about',
  'community',
] as const

export type LinkSource = (typeof LINK_SOURCE_VALUES)[number] | 'unknown'

export type AnalyticsEvent =
  | {
      name: 'article_read'
      properties: { slug: string; language: InterfaceLanguage }
    }
  | {
      name: 'external_link_click'
      properties: { href_host: string; source: LinkSource }
    }
  | {
      name: 'cta_click'
      properties: {
        cta: CtaKind
        location: CtaLocation
        target?: string
      }
    }

type AnalyticsEnv = {
  NEXT_PUBLIC_VERCEL_ENV?: string
  NEXT_PUBLIC_POSTHOG_KEY?: string
}

type NavigatorLike = Pick<Navigator, 'webdriver'>

const queue: AnalyticsEvent[] = []
let capture: ((event: AnalyticsEvent) => void) | null = null

function readAnalyticsEnv(): AnalyticsEnv {
  return {
    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  }
}

export function isAnalyticsEnabled(
  env: AnalyticsEnv = readAnalyticsEnv(),
  navigatorLike: NavigatorLike | undefined = typeof navigator !== 'undefined'
    ? navigator
    : undefined,
): boolean {
  if (env.NEXT_PUBLIC_VERCEL_ENV !== 'production') {
    return false
  }
  if (!env.NEXT_PUBLIC_POSTHOG_KEY) {
    return false
  }
  if (navigatorLike?.webdriver === true) {
    return false
  }
  return true
}

export function bindAnalyticsCapture(
  fn: (event: AnalyticsEvent) => void,
): void {
  capture = fn
  for (const event of queue) {
    fn(event)
  }
  queue.length = 0
}

export function discardAnalyticsQueue(): void {
  queue.length = 0
}

export function track(event: AnalyticsEvent): void {
  if (!isAnalyticsEnabled()) {
    return
  }
  if (capture) {
    capture(event)
    return
  }
  queue.push(event)
}

/** Clears queue and capture binding (unit tests only). */
export function resetAnalyticsStateForTests(): void {
  queue.length = 0
  capture = null
}
