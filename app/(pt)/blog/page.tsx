import type { Metadata } from 'next'
import { BlogView } from '@/components/blog-view'
import { getBlogListingMetadata } from '@/lib/i18n/page-metadata'
import { getBlogListing } from '@/lib/page-data'

export async function generateMetadata({
  searchParams,
}: PageProps<'/blog'>): Promise<Metadata> {
  return getBlogListingMetadata(await searchParams, 'pt')
}

export default async function BlogPage({ searchParams }: PageProps<'/blog'>) {
  return <BlogView {...getBlogListing(await searchParams, 'pt')} />
}
