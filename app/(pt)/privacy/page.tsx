import type { Metadata, ResolvingMetadata } from 'next'
import { PrivacyView } from '@/components/privacy-view'
import { privacyPage } from '@/content/privacy'
import { getPtStaticPageMetadata } from '@/lib/i18n/pt-static-page-metadata'

export async function generateMetadata(
  _props: PageProps<'/privacy'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return getPtStaticPageMetadata(
    '/privacy',
    {
      seoTitle: privacyPage.title,
      seoDescription: privacyPage.seoDescription,
    },
    parent,
  )
}

export default function PrivacyPage() {
  return <PrivacyView />
}
