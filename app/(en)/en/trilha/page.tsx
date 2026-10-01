import type { Metadata } from 'next'
import { TrilhaView } from '@/components/trilha-view'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function TrilhaPage() {
  return <TrilhaView />
}
