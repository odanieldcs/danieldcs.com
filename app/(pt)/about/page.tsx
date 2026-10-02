import { AboutView } from '@/components/about-view'
import { getLocalizedPageMetadata } from '@/lib/i18n/page-metadata'

export const metadata = getLocalizedPageMetadata('about', 'pt')

export default function AboutPage() {
  return <AboutView />
}
