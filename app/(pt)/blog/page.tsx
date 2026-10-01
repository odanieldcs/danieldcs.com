import type { Metadata } from 'next'
import { BlogView } from '@/components/blog-view'
import { getBlogListing } from '@/lib/page-data'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Artigos e notas de engenharia de Daniel Castro.',
}

export default async function BlogPage({ searchParams }: PageProps<'/blog'>) {
  return <BlogView {...getBlogListing(await searchParams, 'pt')} />
}
