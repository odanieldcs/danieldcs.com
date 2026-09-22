// Internal design-system verification route — not part of public site IA.
// Whether to keep or remove this page is deferred to a later milestone.

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { HeaderMobileMenu } from '@/components/header-nav'
import { LanguageSwitch } from '@/components/ui/language-switch'
import { NavLink } from '@/components/ui/nav-link'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { MdxContent } from '@/lib/content/mdx'
import { contentImageClassName } from '@/lib/content/mdx-components'
import { linkClassName } from '@/lib/link-styles'

export const metadata: Metadata = {
  title: 'Design System (internal)',
  robots: { index: false, follow: false },
}

const colorTokens = [
  { name: 'background', swatch: 'bg-background border border-border' },
  { name: 'foreground', swatch: 'bg-foreground' },
  { name: 'muted', swatch: 'bg-muted' },
  { name: 'border', swatch: 'bg-border' },
  { name: 'link', swatch: 'bg-link' },
  { name: 'accent', swatch: 'bg-accent' },
  { name: 'accent-foreground', swatch: 'bg-accent-foreground' },
  { name: 'label', swatch: 'bg-label' },
] as const

const sampleCode = `\`\`\`ts
const verified = true

function greet(name: string) {
  return \`Hello, \${name}\`
}
\`\`\``

const EXAMPLE_IMAGE = {
  src: '/media/posts/hello-world.png',
  width: 800,
  height: 450,
} as const

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-section">
      <h2 className="mb-content-gap text-h2 font-semibold">{title}</h2>
      {children}
    </section>
  )
}

export default function DesignSystemPage() {
  return (
    <Container as="main" width="page" className="py-section">
      <div className="mb-section flex flex-wrap items-center justify-between gap-inline">
        <div>
          <h1 className="text-h1 font-semibold">Design System</h1>
          <p className="mt-inline text-body text-muted">
            Internal verification for milestone tokens and components.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-inline">
          <ThemeToggle />
          <LanguageSwitch />
        </div>
      </div>

      <Section title="Typography">
        <div className="flex flex-col gap-content-gap">
          <h1 className="text-h1 font-semibold">Heading 1 — text-h1</h1>
          <h2 className="text-h2 font-semibold">Heading 2 — text-h2</h2>
          <h3 className="text-h3 font-semibold">Heading 3 — text-h3</h3>
          <h4 className="text-h4 font-semibold">Heading 4 — text-h4</h4>
          <p className="text-body">
            Body — Inter / text-body. Readable paragraph with comfortable line
            height for long-form content.
          </p>
          <p className="text-caption text-muted">
            Caption — text-caption / text-muted
          </p>
          <p className="font-display text-display-section">
            Home display — Fraunces 500
          </p>
          <p className="text-eyebrow uppercase text-label">
            Eyebrow — text-eyebrow / text-label
          </p>
          <p className="text-note text-foreground/65">
            Note — text-note / foreground 65%
          </p>
          <p className="text-sm font-semibold text-accent">
            Reading link — 14px semibold accent
          </p>
        </div>
      </Section>

      <Section title="Color tokens">
        <ul className="grid list-none gap-content-gap sm:grid-cols-2 lg:grid-cols-3">
          {colorTokens.map((token) => (
            <li key={token.name} className="flex flex-col gap-inline">
              <div className={`h-16 rounded-md ${token.swatch}`} aria-hidden />
              <span className="font-mono text-caption text-muted">
                {token.name}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap gap-inline">
          <Button variant="primary">Primary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </Section>

      <Section title="Links">
        <div className="flex flex-wrap gap-content-gap text-body">
          <Link href="/" className={linkClassName}>
            Internal link
          </Link>
          <a
            href="https://example.com"
            className={linkClassName}
            target="_blank"
            rel="noopener noreferrer"
          >
            External link
          </a>
        </div>
      </Section>

      <Section title="Navigation">
        <div className="flex flex-wrap items-center justify-between gap-content-gap">
          <nav
            aria-label="Nav link samples"
            className="flex flex-wrap gap-content-gap"
          >
            <NavLink href="/design-system">Default</NavLink>
            <NavLink href="/design-system" active>
              Active
            </NavLink>
          </nav>
          <HeaderMobileMenu />
        </div>
      </Section>

      <Section title="Code (Shiki + MDX)">
        {/* Article-width column — Shiki breakout margins assume max-w-content */}
        <div className="mx-auto w-full max-w-content">
          <MdxContent source={sampleCode} />
        </div>
      </Section>

      <Section title="Content image">
        <Image
          src={EXAMPLE_IMAGE.src}
          alt="Example content image"
          width={EXAMPLE_IMAGE.width}
          height={EXAMPLE_IMAGE.height}
          className={contentImageClassName}
          sizes="(min-width: 48rem) 42rem, 100vw"
        />
      </Section>
    </Container>
  )
}
