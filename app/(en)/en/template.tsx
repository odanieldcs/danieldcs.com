import type { ReactNode } from 'react'
import { PageEnter } from '@/components/layout/page-enter'

export default function Template({ children }: { children: ReactNode }) {
  return <PageEnter>{children}</PageEnter>
}
