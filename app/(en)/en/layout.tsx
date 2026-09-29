import { SiteShell } from '@/components/site-shell'
import { baseMetadata } from '@/lib/metadata'

export const metadata = baseMetadata

export default function RootLayout({ children }: LayoutProps<'/en'>) {
  return <SiteShell language="en">{children}</SiteShell>
}
