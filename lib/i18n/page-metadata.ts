import type { Metadata } from 'next'
import { parseBlogPage } from '@/lib/blog/pagination'
import { getAlternates } from '@/lib/i18n/alternates'
import { getPageSeo, type SeoPageId } from '@/lib/i18n/pages'
import { localizePath } from '@/lib/i18n/routes'
import type { InterfaceLanguage } from '@/lib/i18n/types'
import { baseMetadata } from '@/lib/metadata'

const openGraphLocale = {
  pt: 'pt_BR',
  en: 'en_US',
} as const satisfies Record<InterfaceLanguage, string>

const pagePath = {
  home: '/',
  blog: '/blog',
  community: '/community',
  about: '/about',
  trilha: '/trilha',
} as const satisfies Record<SeoPageId, `/${string}`>

export function getLocalizedPageMetadata(
  page: SeoPageId,
  language: InterfaceLanguage,
): Metadata {
  const pathname = localizePath(pagePath[page], language)
  const seo = getPageSeo(page, language)
  const description = seo.seoDescription

  return {
    ...(seo.seoTitle ? { title: seo.seoTitle } : {}),
    description,
    openGraph: {
      title: seo.seoTitle ?? baseMetadata.title.default,
      description,
      url: pathname,
      locale: openGraphLocale[language],
      alternateLocale:
        language === 'pt' ? openGraphLocale.en : openGraphLocale.pt,
    },
    alternates: getAlternates(pathname),
    ...(page === 'trilha' ? { robots: { index: false, follow: false } } : {}),
  }
}

/** `view` is not part of the canonical. `page` above 1 is, including hreflang. */
export function getBlogListingMetadata(
  searchParams: Record<string, string | string[] | undefined>,
  language: InterfaceLanguage,
): Metadata {
  const metadata = getLocalizedPageMetadata('blog', language)
  const page = parseBlogPage(searchParams.page)
  const languages = metadata.alternates?.languages

  if (page <= 1 || !languages) {
    return metadata
  }

  const pathname = localizePath(pagePath.blog, language)
  const suffix = `?page=${page}`
  const url = `${pathname}${suffix}`

  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, url },
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        Object.entries(languages).flatMap(([locale, href]) =>
          typeof href === 'string' ? [[locale, `${href}${suffix}`]] : [],
        ),
      ),
    },
  }
}
