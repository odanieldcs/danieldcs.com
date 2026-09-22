import type { Metadata } from 'next'
import { TrilhaView } from '@/components/trilha-view'

export const metadata: Metadata = {
  title: 'Trilha',
}

export default function TrilhaPage() {
  return <TrilhaView />
}
