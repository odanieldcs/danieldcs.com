import Link from 'next/link'
import { Suspense } from 'react'
import { Container } from '@/components/container'
import { HeaderNav, HeaderNavLinks } from '@/components/header-nav'
import { LanguageSwitch } from '@/components/ui/language-switch'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { siteName } from '@/lib/site'

const siteNameClassName = [
  'rounded-sm text-body font-medium text-foreground',
  'outline-none focus-visible:ring-2 focus-visible:ring-foreground/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
].join(' ')

export function Header() {
  return (
    <header>
      <Container
        width="page"
        className="flex items-center gap-content-gap py-inline"
      >
        <Link href="/" className={siteNameClassName}>
          {siteName}
        </Link>
        <Suspense fallback={<HeaderNavLinks pathname={null} />}>
          <HeaderNav />
        </Suspense>
        <div className="ml-auto flex items-center gap-inline">
          {/* Mobile menu mounts here in the next phase. */}
          <div className="md:hidden" />
          <ThemeToggle />
          <LanguageSwitch />
        </div>
      </Container>
    </header>
  )
}
