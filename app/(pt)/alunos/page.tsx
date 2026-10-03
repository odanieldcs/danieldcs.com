import type { Metadata } from 'next'
import { AlunosView } from '@/components/alunos-view'
import { certificatePage } from '@/lib/content/certificates'
import { getAlternates } from '@/lib/i18n/alternates'

export const metadata: Metadata = {
  title: certificatePage.title,
  description: certificatePage.intro,
  robots: { index: false },
  alternates: getAlternates('/alunos'),
}

export default function AlunosPage() {
  return <AlunosView />
}
