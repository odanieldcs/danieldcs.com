import { Fraunces, Inter } from 'next/font/google'
import type { ReactNode } from 'react'
import { InterfaceLanguageProvider } from '@/components/interface-language-provider'
import { BootProgress } from '@/components/layout/boot-progress'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { LoadingBar } from '@/components/layout/loading-indicator'
import { NavigationProgress } from '@/components/layout/navigation-progress'
import { SkipLink } from '@/components/layout/skip-link'
import { ThemeProvider } from '@/components/theme-provider'
import { geistMono } from '@/lib/fonts/geist-mono'
import { getDictionary } from '@/lib/i18n/dictionary'
import { htmlLang, type InterfaceLanguage } from '@/lib/i18n/types'
import '@/app/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-fraunces',
  display: 'swap',
})

export function SiteShell({
  language,
  children,
}: {
  language: InterfaceLanguage
  children: ReactNode
}) {
  const skipLabel = getDictionary(language).skipLink.label

  return (
    <html
      lang={htmlLang[language]}
      className={`${inter.variable} ${geistMono.variable} ${fraunces.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background font-sans text-foreground antialiased">
        <ThemeProvider>
          <InterfaceLanguageProvider language={language}>
            <LoadingBar
              phase="loading"
              className="boot-progress fixed inset-x-0 top-0 z-40"
            />
            <BootProgress />
            <NavigationProgress />
            <SkipLink label={skipLabel} />
            <Header language={language} />
            <div id="conteudo" tabIndex={-1}>
              {children}
            </div>
            <Footer />
          </InterfaceLanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
