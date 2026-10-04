import type { MetadataRoute } from 'next'
import { getAllPosts, type PostSummary } from '@/lib/content/posts'
import { getAlternates, isCanonicalUrl, localizedPages } from '@/lib/i18n/alternates'
import { interfaceLanguages } from '@/lib/i18n/types'
import { absoluteSiteUrl } from '@/lib/site'

function absoluteLanguages(
  languages: NonNullable<ReturnType<typeof getAlternates>['languages']>,
): NonNullable<MetadataRoute.Sitemap[number]['alternates']>['languages'] {
  return Object.fromEntries(
    Object.entries(languages).flatMap(([locale, href]) =>
      typeof href === 'string' ? [[locale, absoluteSiteUrl(href)]] : [],
    ),
  )
}

function staticSitemapEntries(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const page of localizedPages) {
    if (!page.indexable) {
      continue
    }

    for (const language of interfaceLanguages) {
      const pathname = page[language]
      const alternates = getAlternates(pathname)
      const languages = alternates.languages

      entries.push({
        url: absoluteSiteUrl(pathname),
        ...(languages ? { alternates: { languages: absoluteLanguages(languages) } } : {}),
      })
    }
  }

  return entries
}

function postSitemapEntries(posts: PostSummary[]): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const post of posts) {
    const pathname = `/blog/${post.slug}`
    if (!isCanonicalUrl(pathname)) {
      continue
    }

    entries.push({
      url: absoluteSiteUrl(pathname),
      lastModified: post.frontmatter.updatedAt ?? post.frontmatter.date,
    })
  }

  return entries
}

export function buildSitemap(
  posts = getAllPosts(),
): MetadataRoute.Sitemap {
  return [...staticSitemapEntries(), ...postSitemapEntries(posts)]
}
