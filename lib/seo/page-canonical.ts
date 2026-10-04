import { getAlternates } from '@/lib/i18n/alternates'

/** Relative canonical pathname from alternates for indexable static pages. */
export function getPageCanonicalPath(pathname: string): string {
  const alternates = getAlternates(pathname)
  return typeof alternates.canonical === 'string'
    ? alternates.canonical
    : pathname
}
