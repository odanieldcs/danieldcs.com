import type { Metadata } from 'next'
import { siteUrl } from '@/lib/site'

export const defaultDescription =
  'Daniel Castro, engenheiro de software. Artigos, palestras e aprendizados de Dev para Dev.'

/** Relative RSS alternate. `metadataBase` resolves it to https://danieldcs.com/feed. */
export const rssFeedTypes = {
  'application/rss+xml': '/feed',
} as const

/**
 * Metadata shared by both root layouts. Per-page canonicals land in ENG-118.
 * Icons and the default share image come from the file conventions beside
 * each root layout. `metadataBase` makes `og:image`, `twitter:image`, and the
 * RSS alternate absolute. Next keeps icon link hrefs root-relative.
 *
 * A page that sets `alternates` replaces this object, so it repeats `rssFeedTypes`.
 */
export const baseMetadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Daniel Castro', template: '%s · Daniel Castro' },
  description: defaultDescription,
  alternates: { types: rssFeedTypes },
  openGraph: { siteName: 'Daniel Castro', type: 'website', locale: 'pt_BR' },
  twitter: { card: 'summary_large_image' },
} satisfies Metadata
