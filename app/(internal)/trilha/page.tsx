import type { Metadata } from 'next'
import { TrilhaView } from '@/components/trilha-view'

export const metadata: Metadata = {
  title: 'Trilha',
  description:
    'Guiado por quem aplica no dia a dia, em engenharia de software.',
  robots: { index: false, follow: false },
}

export default function TrilhaPage() {
  return <TrilhaView />
}
