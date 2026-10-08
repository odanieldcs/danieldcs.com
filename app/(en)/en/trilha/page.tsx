import type { Metadata, ResolvingMetadata } from 'next'
import { TrilhaView } from '@/components/views/trilha-view'
import { getLocalizedPageMetadata } from '@/lib/i18n/page-metadata'

export async function generateMetadata(
  _props: PageProps<'/en/trilha'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return getLocalizedPageMetadata('trilha', 'en', (await parent).openGraph)
}

export default function TrilhaPage() {
  return <TrilhaView />
}
