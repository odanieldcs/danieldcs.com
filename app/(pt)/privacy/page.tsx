import type { Metadata, ResolvingMetadata } from 'next'
import { PrivacyView } from '@/components/views/privacy-view'
import { getLocalizedPageMetadata } from '@/lib/i18n/page-metadata'

export async function generateMetadata(
  _props: PageProps<'/privacy'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return getLocalizedPageMetadata('privacy', 'pt', (await parent).openGraph)
}

export default function PrivacyPage() {
  return <PrivacyView language="pt" />
}
