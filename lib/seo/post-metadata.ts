import type { Metadata } from 'next'
import type { StaticImageData } from 'next/image'
import type { PostSummary } from '@/lib/content/posts'
import { getAlternates } from '@/lib/i18n/alternates'
import type { InterfaceLanguage } from '@/lib/i18n/types'
import { baseMetadata } from '@/lib/metadata'
import { getPostCanonicalPath } from '@/lib/seo/post-canonical'
import {
  type PostShareImage,
  resolvePostShareImage,
} from '@/lib/seo/share-image'

/** Open Graph `og:locale` value for each content language. */
const ogLocale: Record<InterfaceLanguage, string> = {
  pt: 'pt_BR',
  en: 'en_US',
}

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

  const alternates = getAlternates(`/blog/${post.slug}`)
  const canonical = getPostCanonicalPath(post.slug)

  const image: PostShareImage = resolvePostShareImage(
    frontmatter.cover,
    fallbackImage,
  )

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
