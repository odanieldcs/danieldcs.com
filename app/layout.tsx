import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { InterfaceLanguageProvider } from '@/components/interface-language-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { getInterfaceLanguageFromCookieStore } from '@/lib/i18n/cookie'
import './globals.css'

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
      className={`${GeistSans.variable} ${GeistMono.variable}`}
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
