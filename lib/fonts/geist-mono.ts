import localFont from 'next/font/local'

export const geistMono = localFont({
  src: './GeistMono-Variable.woff2',
  variable: '--font-geist-mono',
  weight: '100 900',
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
})
