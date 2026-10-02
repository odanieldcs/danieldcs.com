import { HomeView } from '@/components/home-view'
import { getLocalizedPageMetadata } from '@/lib/i18n/page-metadata'
import { getHomePosts } from '@/lib/page-data'

export const metadata = getLocalizedPageMetadata('home', 'pt')

export default function Home() {
  return <HomeView posts={getHomePosts()} />
}
