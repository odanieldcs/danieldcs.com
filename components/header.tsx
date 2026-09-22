import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { Container } from '@/components/container'
import {
  HeaderMobileMenu,
  HeaderNav,
  HeaderNavLinks,
} from '@/components/header-nav'
import { LanguageSwitch } from '@/components/ui/language-switch'
import { ThemeToggle } from '@/components/ui/theme-toggle'

const homeLinkClassName = [
  'inline-flex min-w-0 items-center gap-3 rounded-sm text-foreground',
  'outline-none focus-visible:ring-2 focus-visible:ring-foreground/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
].join(' ')

export function Header() {
  return (
    <header className="relative z-20 bg-background">
      <Container
        width="page"
        className="grid grid-cols-[1fr_auto_1fr] items-center gap-content-gap py-inline"
      >
        <Link href="/" className={`${homeLinkClassName} justify-self-start`}>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#212121]">
            <Image
              src="/media/icons/logo-ddev.png"
              alt=""
              width={145}
              height={150}
              priority
              className="h-5 w-auto"
            />
          </span>
          <span className="truncate font-display text-xl font-medium">
            Daniel Castro
          </span>
        </Link>
        <div className="w-0 min-w-0 justify-self-center overflow-hidden md:w-auto md:overflow-visible">
          <Suspense fallback={<HeaderNavLinks pathname={null} />}>
            <HeaderNav />
          </Suspense>
        </div>
        <div className="flex items-center justify-self-end gap-inline">
          <div className="md:hidden">
            <HeaderMobileMenu />
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <LanguageSwitch />
          </div>
        </div>
      </Container>
    </header>
  )
}
