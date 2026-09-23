import type { Metadata } from 'next'
import { AboutView } from '@/components/about-view'

export const metadata: Metadata = {
  title: 'Sobre',
  description: 'Trajetória, repertório e contato de Daniel Castro.',
}

export default function AboutPage() {
  return <AboutView />
}
