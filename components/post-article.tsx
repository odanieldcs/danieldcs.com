import Image from 'next/image'
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
import type { InterfaceLanguage } from '@/lib/i18n/types'

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
          priority
        />
      ) : null}
      {frontmatter.language !== language ? (
        <p role="note" className="mt-3 text-caption text-muted">
          {getPostCopy(language).onlyAvailableIn[frontmatter.language]}
        </p>
      ) : null}
      <MdxContent source={content} />
    </Container>
  )
}
