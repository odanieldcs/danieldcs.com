import type { Metadata } from 'next'
import { AlunosView } from '@/components/alunos-view'
import { certificatePage } from '@/lib/content/certificates'
import { getAlternates } from '@/lib/i18n/alternates'
import { rssFeedTypes } from '@/lib/metadata'

export const metadata: Metadata = {
  title: certificatePage.title,
  description: certificatePage.intro,
  robots: { index: false },
  alternates: { ...getAlternates('/alunos'), types: rssFeedTypes },
}

export default function AlunosPage() {
  return <AlunosView />
}
