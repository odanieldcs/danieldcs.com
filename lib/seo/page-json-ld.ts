import defaultOpenGraphImage from '@/app/(pt)/opengraph-image.png'
import type { PostSummary } from '@/lib/content/posts'
import { localizePath } from '@/lib/i18n/routes'
import { htmlLang, type InterfaceLanguage } from '@/lib/i18n/types'
import {
  buildAboutJsonLd,
  buildHomeJsonLd,
  buildPostJsonLd,
  type JsonLdDocument,
} from '@/lib/seo/json-ld'
import { getPageCanonicalPath } from '@/lib/seo/page-canonical'
import { getPostCanonicalPathOrDefault } from '@/lib/seo/post-canonical'
import {
  absolutePostShareImageUrl,
  resolvePostShareImage,
} from '@/lib/seo/share-image'
import { absoluteSiteUrl } from '@/lib/site'

export function getHomeJsonLd(language: InterfaceLanguage): JsonLdDocument {
  return buildHomeJsonLd(htmlLang[language])
}

export function getAboutJsonLd(language: InterfaceLanguage): JsonLdDocument {
  const pathname = localizePath('/about', language)

  return buildAboutJsonLd({
    url: absoluteSiteUrl(getPageCanonicalPath(pathname)),
    inLanguage: htmlLang[language],
  })
}

export function getPostJsonLd(post: PostSummary): JsonLdDocument {
  const image = resolvePostShareImage(
    post.frontmatter.cover,
    defaultOpenGraphImage,
  )

  return buildPostJsonLd({
    frontmatter: post.frontmatter,
    url: absoluteSiteUrl(getPostCanonicalPathOrDefault(post.slug)),
    image: absolutePostShareImageUrl(image),
  })
}
