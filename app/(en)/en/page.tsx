import type { Metadata, ResolvingMetadata } from 'next'
import { JsonLd } from '@/components/json-ld'
import { HomeView } from '@/components/views/home-view'
import { getLocalizedPageMetadata } from '@/lib/i18n/page-metadata'
import { getHomeJsonLd, getHomePosts } from '@/lib/page-data'

export async function generateMetadata(
  _props: PageProps<'/en'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return getLocalizedPageMetadata('home', 'en', (await parent).openGraph)
}

export default function Home() {
  return (
    <>
      <JsonLd data={getHomeJsonLd('en')} />
      <HomeView posts={getHomePosts()} />
    </>
  )
}
