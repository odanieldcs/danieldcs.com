import type { Metadata, ResolvingMetadata } from 'next'
import { TrilhaView } from '@/components/trilha-view'
import { getLocalizedPageMetadata } from '@/lib/i18n/page-metadata'

export async function generateMetadata(
  _props: PageProps<'/trilha'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return getLocalizedPageMetadata('trilha', 'pt', (await parent).openGraph)
}

export default function TrilhaPage() {
  return <TrilhaView />
}
