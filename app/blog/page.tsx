import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { type BlogPostView, BlogView } from '@/components/blog-view'
import {
  buildBlogListingHref,
  getBlogPageCount,
  normalizeBlogPage,
  parseBlogPage,
  parseBlogView,
  sliceBlogPage,
} from '@/lib/blog/pagination'
import { getAllPosts } from '@/lib/content/posts'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Artigos e notas de engenharia de Daniel Castro.',
}

export default async function BlogPage({ searchParams }: PageProps<'/blog'>) {
  const params = await searchParams
  const view = parseBlogView(params.view)
  const requestedPage = parseBlogPage(params.page)
  const allPosts = getAllPosts()
  const pageCount = getBlogPageCount(allPosts.length)
  const page = normalizeBlogPage(requestedPage, pageCount)

  if (requestedPage !== page) {
    redirect(buildBlogListingHref({ page, view }))
  }

  const pagePosts = sliceBlogPage(allPosts, page)
  const posts: BlogPostView[] = pagePosts.map((post) => ({
    slug: post.slug,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    date: post.frontmatter.date.toISOString(),
    cover: post.frontmatter.cover,
  }))

  return (
    <BlogView posts={posts} view={view} page={page} pageCount={pageCount} />
  )
}
