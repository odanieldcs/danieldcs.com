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
