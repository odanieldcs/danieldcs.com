import type { Metadata } from 'next'
import { type HomePostSummary, HomeView } from '@/components/home-view'
import { getAllPosts } from '@/lib/content/posts'

const RECENT_POST_LIMIT = 2

export const metadata: Metadata = {
  description: 'Building software products and running long distances.',
}

export default async function Home() {
  const posts: HomePostSummary[] = getAllPosts()
    .slice(0, RECENT_POST_LIMIT)
    .map((post) => ({
      slug: post.slug,
      title: post.frontmatter.title,
      date: post.frontmatter.date.toISOString(),
      description: post.frontmatter.description,
      language: post.frontmatter.language,
      tag: post.frontmatter.tags[0],
    }))

  return <HomeView posts={posts} />
}
