import type { Metadata, ResolvingMetadata } from 'next'
import { AboutView } from '@/components/about-view'
import { getLocalizedPageMetadata } from '@/lib/i18n/page-metadata'

export async function generateMetadata(
  _props: PageProps<'/about'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return getLocalizedPageMetadata('about', 'pt', (await parent).openGraph)
}

export default function AboutPage() {
  return <AboutView />
}
