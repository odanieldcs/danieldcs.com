import type { Metadata, ResolvingMetadata } from 'next'
import { CommunityView } from '@/components/views/community-view'
import { getLocalizedPageMetadata } from '@/lib/i18n/page-metadata'
import { getCommunityEntryViews } from '@/lib/page-data'

export async function generateMetadata(
  _props: PageProps<'/en/community'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return getLocalizedPageMetadata('community', 'en', (await parent).openGraph)
}

export default function CommunityPage() {
  return <CommunityView entries={getCommunityEntryViews()} />
}
