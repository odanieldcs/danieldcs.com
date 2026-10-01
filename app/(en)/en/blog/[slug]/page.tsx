import type { Metadata } from 'next'
import { PostArticle } from '@/components/post-article'
import { getPost, getPostMetadata, getPostStaticParams } from '@/lib/page-data'

// Unknown slugs must 404 at routing; see app/(pt)/blog/[slug]/page.tsx.
export const dynamicParams = false

export function generateStaticParams() {
  return getPostStaticParams()
}

export async function generateMetadata({
  params,
}: PageProps<'/en/blog/[slug]'>): Promise<Metadata> {
  return getPostMetadata((await params).slug)
}

export default async function BlogPostPage({
  params,
}: PageProps<'/en/blog/[slug]'>) {
  return <PostArticle post={getPost((await params).slug)} language="en" />
}
