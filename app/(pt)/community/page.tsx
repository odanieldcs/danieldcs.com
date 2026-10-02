import { CommunityView } from '@/components/community-view'
import { getLocalizedPageMetadata } from '@/lib/i18n/page-metadata'
import { getCommunityEntryViews } from '@/lib/page-data'

export const metadata = getLocalizedPageMetadata('community', 'pt')

export default function CommunityPage() {
  return <CommunityView entries={getCommunityEntryViews()} />
}
