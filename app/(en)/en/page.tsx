import { HomeView } from '@/components/home-view'
import { getHomePosts } from '@/lib/page-data'

export default function Home() {
  return <HomeView posts={getHomePosts()} />
}
