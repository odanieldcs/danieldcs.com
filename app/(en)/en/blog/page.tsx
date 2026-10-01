import { BlogView } from '@/components/blog-view'
import { getBlogListing } from '@/lib/page-data'

export default async function BlogPage({
  searchParams,
}: PageProps<'/en/blog'>) {
  return <BlogView {...getBlogListing(await searchParams, 'en')} />
}
