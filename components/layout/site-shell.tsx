import { GeistMono } from 'geist/font/mono'
import { Fraunces, Inter } from 'next/font/google'
import type { ReactNode } from 'react'
import { InterfaceLanguageProvider } from '@/components/interface-language-provider'
import { BootProgress } from '@/components/layout/boot-progress'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { LoadingBar } from '@/components/layout/loading-indicator'
import { NavigationProgress } from '@/components/layout/navigation-progress'
import { ThemeProvider } from '@/components/theme-provider'
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
  return (
    <html
      lang={htmlLang[language]}
      className={`${inter.variable} ${GeistMono.variable} ${fraunces.variable}`}
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
            <Header language={language} />
            {children}
            <Footer />
          </InterfaceLanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
