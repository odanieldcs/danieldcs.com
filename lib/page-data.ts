import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import type { BlogPostView } from '@/components/blog-view'
import type { CommunityEntryView } from '@/components/community-view'
import type { HomePostSummary } from '@/components/home-view'
import {
  type BlogViewMode,
  buildBlogListingHref,
  getBlogPageCount,
  normalizeBlogPage,
  parseBlogPage,
  parseBlogView,
  sliceBlogPage,
} from '@/lib/blog/pagination'
import { getAllCommunityEntries } from '@/lib/content/community'
import {
  getAllPostSlugs,
  getAllPosts,
  getPostBySlug,
} from '@/lib/content/posts'
import type { InterfaceLanguage } from '@/lib/i18n/types'

const RECENT_POST_LIMIT = 2

export function getHomePosts(): HomePostSummary[] {
  return getAllPosts()
    .slice(0, RECENT_POST_LIMIT)
    .map((post) => ({
      slug: post.slug,
      title: post.frontmatter.title,
      date: post.frontmatter.date.toISOString(),
      description: post.frontmatter.description,
      language: post.frontmatter.language,
      tag: post.frontmatter.tags[0],
    }))
}

type BlogListing = {
  posts: BlogPostView[]
  view: BlogViewMode
  page: number
  pageCount: number
}

/** Redirects to the clamped page when `?page` is out of range. */
export function getBlogListing(
  searchParams: Record<string, string | string[] | undefined>,
  language: InterfaceLanguage,
): BlogListing {
  const view = parseBlogView(searchParams.view)
  const requestedPage = parseBlogPage(searchParams.page)
  const allPosts = getAllPosts()
  const pageCount = getBlogPageCount(allPosts.length)
  const page = normalizeBlogPage(requestedPage, pageCount)

  if (requestedPage !== page) {
    redirect(buildBlogListingHref({ page, view, language }))
  }

  const posts = sliceBlogPage(allPosts, page).map((post) => ({
    slug: post.slug,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    date: post.frontmatter.date.toISOString(),
    cover: post.frontmatter.cover,
  }))

  return { posts, view, page, pageCount }
}

export function getCommunityEntryViews(): CommunityEntryView[] {
  return getAllCommunityEntries().map((entry) => ({
    slug: entry.slug,
    title: entry.frontmatter.title,
    description: entry.frontmatter.description,
    date: entry.frontmatter.date.toISOString(),
    type: entry.frontmatter.type,
    language: entry.frontmatter.language,
    eventName: entry.frontmatter.eventName,
    link: entry.frontmatter.link,
    cover: entry.frontmatter.cover,
  }))
}

export const getPost = cache((slug: string) => getPostBySlug(slug))

export function getPostStaticParams(): { slug: string }[] {
  return getAllPostSlugs().map((slug) => ({ slug }))
}

export function getPostMetadata(slug: string): Metadata {
  const { frontmatter } = getPost(slug)

  return {
    title: frontmatter.title,
    description: frontmatter.description,
  }
}
