import { CommunityView } from '@/components/community-view'
import { getCommunityEntryViews } from '@/lib/page-data'

export default function CommunityPage() {
  return <CommunityView entries={getCommunityEntryViews()} />
}
