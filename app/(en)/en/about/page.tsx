import type { Metadata, ResolvingMetadata } from 'next'
import { JsonLd } from '@/components/json-ld'
import { AboutView } from '@/components/views/about-view'
import { getLocalizedPageMetadata } from '@/lib/i18n/page-metadata'
import { getAboutJsonLd } from '@/lib/page-data'

export async function generateMetadata(
  _props: PageProps<'/en/about'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return getLocalizedPageMetadata('about', 'en', (await parent).openGraph)
}

export default function AboutPage() {
  return (
    <>
      <JsonLd data={getAboutJsonLd('en')} />
      <AboutView />
    </>
  )
}
