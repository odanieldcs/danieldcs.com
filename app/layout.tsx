import { GeistMono } from 'geist/font/mono'
import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import { cookies } from 'next/headers'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { InterfaceLanguageProvider } from '@/components/interface-language-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { getInterfaceLanguageFromCookieStore } from '@/lib/i18n/cookie'
import './globals.css'

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

export const metadata: Metadata = {
  title: 'danieldcs.com',
  description: 'Personal website of Daniel Castro',
  icons: {
    icon: '/media/icons/logo-ddev.png',
  },
}

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const initialLanguage = getInterfaceLanguageFromCookieStore(await cookies())

  return (
    <html
      lang={initialLanguage}
      className={`${inter.variable} ${GeistMono.variable} ${fraunces.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background font-sans text-foreground">
        <ThemeProvider>
          <InterfaceLanguageProvider initialLanguage={initialLanguage}>
            <Header />
            {children}
            <Footer />
          </InterfaceLanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
