import type { Metadata } from 'next'
import { SiteShell } from '@/components/layout/site-shell'
import { NotFoundView } from '@/components/views/not-found-view'
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
