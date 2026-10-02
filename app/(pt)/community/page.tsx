import type { Metadata, ResolvingMetadata } from 'next'
import { CommunityView } from '@/components/community-view'
import { getLocalizedPageMetadata } from '@/lib/i18n/page-metadata'
import { getCommunityEntryViews } from '@/lib/page-data'

export async function generateMetadata(
  _props: PageProps<'/community'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return getLocalizedPageMetadata('community', 'pt', (await parent).openGraph)
}

export default function CommunityPage() {
  return <CommunityView entries={getCommunityEntryViews()} />
}
