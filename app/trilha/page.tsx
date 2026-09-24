import type { Metadata } from 'next'
import { TrilhaView } from '@/components/trilha-view'

export const metadata: Metadata = {
  title: 'Trilha',
  description:
    'Aprendizado guiado por quem aplica no dia a dia, em engenharia de software.',
}

export default function TrilhaPage() {
  return <TrilhaView />
}
