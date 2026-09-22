import type { Metadata } from 'next'
import { type HomePostSummary, HomeView } from '@/components/home-view'
import { getAllPosts } from '@/lib/content/posts'

const RECENT_POST_LIMIT = 5

export const metadata: Metadata = {
  description:
    'Software Engineer & Builder. I build software products and systems end to end, and write about what I learn along the way.',
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
    }))

  return <HomeView posts={posts} />
}
