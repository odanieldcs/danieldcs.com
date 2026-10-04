import type { Metadata, ResolvingMetadata } from 'next'
import { AboutView } from '@/components/about-view'
import { JsonLd } from '@/components/json-ld'
import { getLocalizedPageMetadata } from '@/lib/i18n/page-metadata'
import { getAboutJsonLd } from '@/lib/page-data'

export async function generateMetadata(
  _props: PageProps<'/about'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return getLocalizedPageMetadata('about', 'pt', (await parent).openGraph)
}

export default function AboutPage() {
  return (
    <>
      <JsonLd data={getAboutJsonLd('pt')} />
      <AboutView />
    </>
  )
}
