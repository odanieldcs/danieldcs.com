import type { Metadata, ResolvingMetadata } from 'next'
import { getAlternates } from '@/lib/i18n/alternates'
import { baseMetadata } from '@/lib/metadata'

type PtPageSeo = {
  seoTitle: string
  seoDescription: string
}

export async function getPtStaticPageMetadata(
  pathname: `/${string}`,
  seo: PtPageSeo,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const parentOpenGraph = (await parent).openGraph

  return {
    title: seo.seoTitle,
    description: seo.seoDescription,
    openGraph: {
      ...baseMetadata.openGraph,
      ...parentOpenGraph,
      title: seo.seoTitle,
      description: seo.seoDescription,
      url: pathname,
      locale: 'pt_BR',
    },
    alternates: getAlternates(pathname),
  }
}
