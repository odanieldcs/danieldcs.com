import type { Metadata, ResolvingMetadata } from 'next'
import { BlogView } from '@/components/blog-view'
import { getBlogListingMetadata } from '@/lib/i18n/page-metadata'
import { getBlogListing } from '@/lib/page-data'

export async function generateMetadata(
  { searchParams }: PageProps<'/en/blog'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return getBlogListingMetadata(await searchParams, 'en', (await parent).openGraph)
}

export default async function BlogPage({
  searchParams,
}: PageProps<'/en/blog'>) {
  return <BlogView {...getBlogListing(await searchParams, 'en')} />
}
