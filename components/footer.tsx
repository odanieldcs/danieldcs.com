'use client'

import Link from 'next/link'
import { Container } from '@/components/container'
import { useInterfaceLanguage } from '@/components/interface-language-provider'
import { getFooterResourceLinks } from '@/lib/i18n/pages'
import { localizePath } from '@/lib/i18n/routes'
import { linkClassName } from '@/lib/link-styles'
import {
  gitHubProfileUrl,
  instagramProfileUrl,
  linkedInProfileUrl,
  siteName,
  youTubeProfileUrl,
} from '@/lib/site'

const socialLinks = [
  {
    label: 'LinkedIn',
    href: linkedInProfileUrl,
  },
  {
    label: 'GitHub',
    href: gitHubProfileUrl,
  },
  {
    label: 'YouTube',
    href: youTubeProfileUrl,
  },
  {
    label: 'Instagram',
    href: instagramProfileUrl,
  },
] as const

const footerLinkClassName = linkClassName.replace('text-link', 'text-muted')

function footerNavTarget(href: string): string {
  const segments = href.split('/').filter(Boolean)
  return segments[segments.length - 1] ?? ''
}

export function Footer() {
  const { language } = useInterfaceLanguage()
  const year = new Date().getFullYear()
  const privacyLabel = language === 'pt' ? 'Privacidade' : 'Privacy'
  const resourceLinks = getFooterResourceLinks(language)

  return (
    <footer
      className="border-t border-border py-4"
      data-analytics-source="footer"
    >
      <Container
        width="page"
        className="flex flex-col items-center gap-content-gap py-section text-center"
      >
        <ul className="flex list-none flex-wrap justify-center gap-content-gap text-caption">
          {socialLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={footerLinkClassName}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            </li>
          ))}
          {resourceLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={localizePath(link.href, language)}
                className={footerLinkClassName}
                data-cta="nav_item"
                data-cta-location="footer"
                data-cta-target={footerNavTarget(link.href)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="flex flex-wrap items-center justify-center gap-x-content-gap text-caption text-muted">
          <span>
            © {year} {siteName}
          </span>
          <Link
            href={localizePath('/privacy', language)}
            className={footerLinkClassName}
            data-cta="nav_item"
            data-cta-location="footer"
            data-cta-target="privacy"
          >
            {privacyLabel}
          </Link>
          <span>Made with love in Gravataí 🇧🇷</span>
        </p>
      </Container>
    </footer>
  )
}
