import { GeistMono } from 'geist/font/mono'
import { Fraunces, Inter } from 'next/font/google'
import type { ReactNode } from 'react'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { InterfaceLanguageProvider } from '@/components/interface-language-provider'
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
      <body className="bg-background font-sans text-foreground">
        <ThemeProvider>
          <InterfaceLanguageProvider language={language}>
            <Header />
            {children}
            <Footer />
          </InterfaceLanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
