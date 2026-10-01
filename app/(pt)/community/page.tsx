import type { Metadata } from 'next'
import { CommunityView } from '@/components/community-view'
import { getCommunityEntryViews } from '@/lib/page-data'

export const metadata: Metadata = {
  title: 'Comunidade',
  description: 'Palestras, workshops e encontros de Daniel Castro.',
}

export default function CommunityPage() {
  return <CommunityView entries={getCommunityEntryViews()} />
}
