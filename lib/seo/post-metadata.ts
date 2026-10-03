import type { Metadata } from 'next'
import type { StaticImageData } from 'next/image'
import { resolveCoverSrc } from '@/lib/content/cover'
import type { PostSummary } from '@/lib/content/posts'
import { getAlternates } from '@/lib/i18n/alternates'
import type { InterfaceLanguage } from '@/lib/i18n/types'
import { baseMetadata } from '@/lib/metadata'

/** Open Graph `og:locale` value for each content language. */
const ogLocale: Record<InterfaceLanguage, string> = {
  pt: 'pt_BR',
  en: 'en_US',
}

type OpenGraphImage = { url: string; width?: number; height?: number }

/**
 * Pure metadata builder for a blog post, derived entirely from frontmatter.
 * Framework-free so it can be unit-tested without Next.
 *
 * `fallbackImage` is the shared default Open Graph image (ENG-119), injected by
 * the Next page layer, used when a post has no `cover`.
 */
export function buildPostMetadata(
  post: PostSummary,
  fallbackImage: StaticImageData,
): Metadata {
  const { frontmatter } = post

  // Canonical is owned by getAlternates: /en/blog/<slug> resolves to the PT
  // /blog/<slug>, with no hreflang while posts are PT-only.
  const alternates = getAlternates(`/blog/${post.slug}`)
  const canonical =
    typeof alternates.canonical === 'string' ? alternates.canonical : undefined

  const image: OpenGraphImage = frontmatter.cover
    ? { url: resolveCoverSrc(frontmatter.cover) }
    : {
        url: fallbackImage.src,
        width: fallbackImage.width,
        height: fallbackImage.height,
      }

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    alternates,
    openGraph: {
      ...baseMetadata.openGraph,
      type: 'article',
      url: canonical,
      locale: ogLocale[frontmatter.language],
      // Set explicitly so og:title keeps the raw post title; the top-level
      // title applies the "%s · Daniel Castro" template. og:description is
      // omitted on purpose: Next derives it from the top-level description.
      title: frontmatter.title,
      publishedTime: frontmatter.date.toISOString(),
      ...(frontmatter.updatedAt && {
        modifiedTime: frontmatter.updatedAt.toISOString(),
      }),
      tags: frontmatter.tags,
      images: [image],
    },
    twitter: {
      ...baseMetadata.twitter,
      images: [image],
    },
  }
}
