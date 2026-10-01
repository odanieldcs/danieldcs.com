import type { Metadata } from 'next'
import { siteUrl } from '@/lib/site'

export const defaultDescription =
  'Daniel Castro, engenheiro de software. Artigos, palestras e aprendizados de Dev para Dev.'

/**
 * Metadata shared by both root layouts. Per-page canonicals land in ENG-118.
 * Icons and the default share image come from the file conventions beside
 * each root layout. `metadataBase` resolves relative URLs to the production origin.
 */
export const baseMetadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Daniel Castro', template: '%s · Daniel Castro' },
  description: defaultDescription,
  openGraph: { siteName: 'Daniel Castro', type: 'website', locale: 'pt_BR' },
  twitter: { card: 'summary_large_image' },
} satisfies Metadata
