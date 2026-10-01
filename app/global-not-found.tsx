import type { Metadata } from 'next'
import { NotFoundView } from '@/components/not-found-view'
import { SiteShell } from '@/components/site-shell'
import { baseMetadata } from '@/lib/metadata'

export const metadata: Metadata = {
  ...baseMetadata,
  title: 'Página não encontrada · Daniel Castro',
  robots: { index: false },
}

export default function GlobalNotFound() {
  return (
    <SiteShell language="pt">
      <NotFoundView language="pt" />
    </SiteShell>
  )
}
