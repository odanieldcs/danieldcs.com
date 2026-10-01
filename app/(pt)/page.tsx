import type { Metadata } from 'next'
import { HomeView } from '@/components/home-view'
import { getHomePosts } from '@/lib/page-data'

export const metadata: Metadata = {
  description: 'Construindo produtos de software e correndo longas distâncias.',
}

export default function Home() {
  return <HomeView posts={getHomePosts()} />
}
