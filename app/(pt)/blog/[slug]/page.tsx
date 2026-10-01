import type { Metadata } from 'next'
import Image from 'next/image'
import { cache } from 'react'
import { Container } from '@/components/container'
import { MdxContent } from '@/lib/content/mdx'
import {
  articleDateClassName,
  articleTagsListClassName,
  articleTitleClassName,
  contentImageClassName,
} from '@/lib/content/mdx-components'
import { getAllPostSlugs, getPostBySlug } from '@/lib/content/posts'

const COVER_WIDTH = 800
const COVER_HEIGHT = 450

const getPost = cache((slug: string) => getPostBySlug(slug))

function resolveCoverSrc(cover: string): string {
  if (cover.startsWith('/') && !cover.startsWith('//')) {
    return cover
  }

  return `/media/posts/${cover}`
}

function formatPostDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

// With two root layouts, a notFound() thrown while rendering yields Next's bare
// error document. Unknown slugs must 404 at routing, where
// app/global-not-found.tsx handles them.
export const dynamicParams = false

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  }
}

export default async function BlogPostPage({
  params,
}: PageProps<'/blog/[slug]'>) {
  const { slug } = await params
  const post = getPost(slug)

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
      <MdxContent source={content} />
    </Container>
  )
}
