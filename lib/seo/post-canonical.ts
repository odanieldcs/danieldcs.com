import { getAlternates } from '@/lib/i18n/alternates'

/** Relative canonical pathname from alternates (/blog/<slug> for PT-only posts). */
export function getPostCanonicalPath(slug: string): string | undefined {
  const alternates = getAlternates(`/blog/${slug}`)
  return typeof alternates.canonical === 'string'
    ? alternates.canonical
    : undefined
}

export function getPostCanonicalPathOrDefault(slug: string): string {
  return getPostCanonicalPath(slug) ?? `/blog/${slug}`
}
