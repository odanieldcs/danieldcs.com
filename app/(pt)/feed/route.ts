import { getAllPosts, type PostSummary } from '@/lib/content/posts'
import { htmlLang } from '@/lib/i18n/types'
import { defaultDescription, rssFeedTypes } from '@/lib/metadata'
import { getPostCanonicalPath } from '@/lib/seo/post-canonical'
import { buildRssFeed, type RssItem } from '@/lib/seo/rss'
import { absoluteSiteUrl, personName, siteUrl } from '@/lib/site'

export const dynamic = 'force-static'

function postPermalink(slug: string): string {
  const canonical = getPostCanonicalPath(slug)
  if (typeof canonical !== 'string') {
    throw new Error(`Missing canonical for /blog/${slug}`)
  }
  return absoluteSiteUrl(canonical)
}

function toRssItem(post: PostSummary): RssItem {
  const permalink = postPermalink(post.slug)

  return {
    title: post.frontmatter.title,
    link: permalink,
    guid: permalink,
    description: post.frontmatter.description,
    pubDate: post.frontmatter.date,
    categories: post.frontmatter.tags,
  }
}

export function buildFeedXml(
  posts: readonly PostSummary[] = getAllPosts(),
): string {
  const newest = posts[0]
  if (!newest) {
    throw new Error('RSS feed requires at least one post')
  }

  return buildRssFeed(
    {
      title: personName,
      link: siteUrl,
      description: defaultDescription,
      language: htmlLang.pt,
      lastBuildDate: newest.frontmatter.date,
      selfLink: absoluteSiteUrl(rssFeedTypes['application/rss+xml']),
    },
    posts.map(toRssItem),
  )
}

export function GET() {
  return new Response(buildFeedXml(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}
