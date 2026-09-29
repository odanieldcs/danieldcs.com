import type { Metadata } from 'next'
import {
  type CommunityEntryView,
  CommunityView,
} from '@/components/community-view'
import { getAllCommunityEntries } from '@/lib/content/community'

export const metadata: Metadata = {
  title: 'Comunidade',
  description: 'Palestras, workshops e encontros de Daniel Castro.',
}

export default function CommunityPage() {
  const entries: CommunityEntryView[] = getAllCommunityEntries().map(
    (entry) => ({
      slug: entry.slug,
      title: entry.frontmatter.title,
      description: entry.frontmatter.description,
      date: entry.frontmatter.date.toISOString(),
      type: entry.frontmatter.type,
      language: entry.frontmatter.language,
      eventName: entry.frontmatter.eventName,
      link: entry.frontmatter.link,
      cover: entry.frontmatter.cover,
    }),
  )

  return <CommunityView entries={entries} />
}
