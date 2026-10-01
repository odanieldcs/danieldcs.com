import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/container'
import { MdxContent } from '@/lib/content/mdx'
import {
  articleDateClassName,
  articleTagsListClassName,
  articleTitleClassName,
  contentImageClassName,
} from '@/lib/content/mdx-components'
import type { Post } from '@/lib/content/posts'
import { getPostCopy } from '@/lib/i18n/pages'
import { localizePath } from '@/lib/i18n/routes'
import { htmlLang, type InterfaceLanguage } from '@/lib/i18n/types'
import { linkClassName } from '@/lib/link-styles'

const COVER_WIDTH = 800
const COVER_HEIGHT = 450

function resolveCoverSrc(cover: string): string {
  if (cover.startsWith('/') && !cover.startsWith('//')) {
    return cover
  }

  return `/media/posts/${cover}`
}

function formatPostDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function ContentLanguageNotice({
  slug,
  postLanguage,
  language,
}: {
  slug: string
  postLanguage: InterfaceLanguage
  language: InterfaceLanguage
}) {
  const copy = getPostCopy(language)

  return (
    <p
      role="note"
      className="mt-3 mb-inline text-center text-caption text-muted"
    >
      {copy.onlyAvailableIn[postLanguage]}{' '}
      <Link
        href={localizePath(`/blog/${slug}`, postLanguage)}
        hrefLang={htmlLang[postLanguage]}
        className={linkClassName}
      >
        {copy.readIn[postLanguage]}
      </Link>
    </p>
  )
}

export function PostArticle({
  post,
  language,
}: {
  post: Post
  language: InterfaceLanguage
}) {
  const { frontmatter, content } = post
  const coverSrc = frontmatter.cover
    ? resolveCoverSrc(frontmatter.cover)
    : undefined

  return (
    <Container as="article" width="article">
      <h1 className={articleTitleClassName}>{frontmatter.title}</h1>
      <time
        className={articleDateClassName}
        dateTime={frontmatter.date.toISOString()}
      >
        {formatPostDate(frontmatter.date)}
      </time>
      {frontmatter.tags.length > 0 ? (
        <ul className={articleTagsListClassName}>
          {frontmatter.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      ) : null}
      {coverSrc ? (
        <Image
          src={coverSrc}
          alt={frontmatter.title}
          width={COVER_WIDTH}
          height={COVER_HEIGHT}
          className={contentImageClassName}
          sizes="(min-width: 48rem) 42rem, 100vw"
          loading="eager"
          fetchPriority="high"
        />
      ) : null}
      {frontmatter.language !== language ? (
        <ContentLanguageNotice
          slug={post.slug}
          postLanguage={frontmatter.language}
          language={language}
        />
      ) : null}
      <MdxContent source={content} />
    </Container>
  )
}
