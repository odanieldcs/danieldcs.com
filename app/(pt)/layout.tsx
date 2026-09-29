import type { Metadata } from 'next'
import { SiteShell } from '@/components/site-shell'

export const metadata: Metadata = {
  title: 'danieldcs.com',
  description: 'Personal website of Daniel Castro',
  icons: {
    icon: '/media/icons/logo-ddev.png',
  },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return <SiteShell language="pt">{children}</SiteShell>
}
