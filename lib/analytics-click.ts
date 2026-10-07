import {
  type AnalyticsEvent,
  CTA_KINDS,
  CTA_LOCATIONS,
  type CtaKind,
  type CtaLocation,
  LINK_SOURCE_VALUES,
  type LinkSource,
  track,
} from '@/lib/analytics'
import { externalHrefHost } from '@/lib/external-link'

const CTA_KIND_SET = new Set<string>(CTA_KINDS)
const CTA_LOCATION_SET = new Set<string>(CTA_LOCATIONS)
const LINK_SOURCE_SET = new Set<string>(LINK_SOURCE_VALUES)

function parseAllowed<T extends string>(
  value: string | null,
  allowed: ReadonlySet<string>,
): T | null {
  if (!value || !allowed.has(value)) {
    return null
  }
  return value as T
}

function parseLinkSource(element: Element): LinkSource {
  const sourceEl = element.closest('[data-analytics-source]')
  const value = sourceEl?.getAttribute('data-analytics-source') ?? null
  return (
    parseAllowed<Exclude<LinkSource, 'unknown'>>(value, LINK_SOURCE_SET) ??
    'unknown'
  )
}

function eventFromCta(element: Element): AnalyticsEvent | null {
  const ctaEl = element.closest('[data-cta]')
  if (!ctaEl) {
    return null
  }

  const cta = parseAllowed<CtaKind>(
    ctaEl.getAttribute('data-cta'),
    CTA_KIND_SET,
  )
  const location = parseAllowed<CtaLocation>(
    ctaEl.getAttribute('data-cta-location'),
    CTA_LOCATION_SET,
  )
  if (!cta || !location) {
    return null
  }

  const target = ctaEl.getAttribute('data-cta-target')?.trim() || undefined

  return {
    name: 'cta_click',
    properties: { cta, location, ...(target ? { target } : {}) },
  }
}

function eventFromExternalLink(
  element: Element,
  siteHost: string,
): AnalyticsEvent | null {
  const anchor = element.closest('a[href]')
  if (!anchor) {
    return null
  }

  const href = anchor.getAttribute('href')
  if (!href) {
    return null
  }

  const hrefHost = externalHrefHost(href, siteHost)
  if (!hrefHost) {
    return null
  }

  return {
    name: 'external_link_click',
    properties: {
      href_host: hrefHost,
      source: parseLinkSource(element),
    },
  }
}

export function eventFromClick(
  target: Element,
  siteHost: string,
): AnalyticsEvent | null {
  return eventFromCta(target) ?? eventFromExternalLink(target, siteHost)
}

let clickHandler: ((event: MouseEvent) => void) | null = null

export function registerClickTracking(): void {
  if (clickHandler || typeof document === 'undefined') {
    return
  }

  clickHandler = (event: MouseEvent) => {
    const raw = event.target
    const element =
      raw instanceof Element
        ? raw
        : raw instanceof Text
          ? raw.parentElement
          : null
    if (!element) {
      return
    }
    const analyticsEvent = eventFromClick(element, location.hostname)
    if (analyticsEvent) {
      track(analyticsEvent)
    }
  }

  document.addEventListener('click', clickHandler, { capture: true })
}

/** Removes the document listener (unit tests only). */
export function unregisterClickTrackingForTests(): void {
  if (clickHandler) {
    document.removeEventListener('click', clickHandler, { capture: true })
    clickHandler = null
  }
}
