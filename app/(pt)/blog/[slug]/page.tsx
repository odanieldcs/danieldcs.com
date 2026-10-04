import type { Metadata } from 'next'
import { JsonLd } from '@/components/json-ld'
import { PostArticle } from '@/components/post-article'
import {
  getPost,
  getPostJsonLd,
  getPostMetadata,
  getPostStaticParams,
} from '@/lib/page-data'

// With two root layouts, a notFound() thrown while rendering yields Next's bare
// error document. Unknown slugs must 404 at routing, where
// app/global-not-found.tsx handles them.
export const dynamicParams = false

export function generateStaticParams() {
  return getPostStaticParams()
}

export async function generateMetadata({
  params,
}: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  return getPostMetadata((await params).slug)
}

export default async function BlogPostPage({
  params,
}: PageProps<'/blog/[slug]'>) {
  const post = getPost((await params).slug)

  return (
    <>
      <JsonLd data={getPostJsonLd(post)} />
      <PostArticle post={post} language="pt" />
    </>
  )
}
