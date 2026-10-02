import { TrilhaView } from '@/components/trilha-view'
import { getLocalizedPageMetadata } from '@/lib/i18n/page-metadata'

export const metadata = getLocalizedPageMetadata('trilha', 'pt')

export default function TrilhaPage() {
  return <TrilhaView />
}
