import type { Metadata } from 'next'
import { siteUrl } from '@/lib/site'

export const defaultDescription =
  'Daniel Castro, engenheiro de software. Artigos, palestras e aprendizados de Dev para Dev.'

/**
 * Metadata shared by both root layouts. Per-page `og:url`/canonical land in
 * ENG-118 and the OG image in ENG-119; `metadataBase` already resolves any
 * relative URL to the production origin.
 */
export const baseMetadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Daniel Castro', template: '%s · Daniel Castro' },
  description: defaultDescription,
  icons: { icon: '/media/icons/logo-ddev.png' },
  openGraph: { siteName: 'Daniel Castro', type: 'website', locale: 'pt_BR' },
  twitter: { card: 'summary_large_image' },
} satisfies Metadata
