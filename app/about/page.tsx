import type { Metadata } from 'next'
import { AboutView } from '@/components/about-view'

export const metadata: Metadata = {
  title: 'Sobre',
  description: 'Trajetória, skills e formas de colaborar com Daniel Castro.',
}

export default function AboutPage() {
  return <AboutView />
}
