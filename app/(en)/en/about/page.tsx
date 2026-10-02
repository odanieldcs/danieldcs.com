import type { Metadata, ResolvingMetadata } from 'next'
import { AboutView } from '@/components/about-view'
import { getLocalizedPageMetadata } from '@/lib/i18n/page-metadata'

export async function generateMetadata(
  _props: PageProps<'/en/about'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return getLocalizedPageMetadata('about', 'en', (await parent).openGraph)
}

export default function AboutPage() {
  return <AboutView />
}
