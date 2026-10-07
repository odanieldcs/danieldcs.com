function parseHttpUrl(href: string): URL | null {
  try {
    const url = new URL(href)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null
    }
    return url
  } catch {
    return null
  }
}

export function isExternalHref(href: string, siteHost: string): boolean {
  const url = parseHttpUrl(href)
  return url !== null && url.hostname !== siteHost
}

/** Hostname when href is an outbound http(s) URL; otherwise null. */
export function externalHrefHost(
  href: string,
  siteHost: string,
): string | null {
  const url = parseHttpUrl(href)
  if (!url || url.hostname === siteHost) {
    return null
  }
  return url.hostname
}

export function isSponsoredHref(href: string): boolean {
  const lower = href.toLowerCase()
  return (
    lower.includes('amzn.to') ||
    lower.includes('referral') ||
    lower.includes('/ref/') ||
    lower.includes('app.link') ||
    (lower.includes('umbler.com') && lower.includes('?a='))
  )
}

export function externalLinkRel(href: string): string {
  return isSponsoredHref(href) ? 'sponsored noopener' : 'noopener noreferrer'
}
