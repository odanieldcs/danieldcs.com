import type { Metadata, ResolvingMetadata } from 'next'
import { HomeView } from '@/components/home-view'
import { getLocalizedPageMetadata } from '@/lib/i18n/page-metadata'
import { getHomePosts } from '@/lib/page-data'

export async function generateMetadata(
  _props: PageProps<'/'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return getLocalizedPageMetadata('home', 'pt', (await parent).openGraph)
}

export default function Home() {
  return <HomeView posts={getHomePosts()} />
}
