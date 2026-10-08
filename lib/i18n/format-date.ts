import type { InterfaceLanguage } from '@/lib/i18n/types'

export type FormatDateStyle = 'full' | 'monthYear'

function toDate(date: Date | string): Date {
  return typeof date === 'string' ? new Date(date) : date
}

function ptMonthLabel(month: string): string {
  return month.endsWith('.') ? month : `${month}.`
}

function formatPt(date: Date, style: FormatDateStyle): string {
  const options: Intl.DateTimeFormatOptions =
    style === 'full'
      ? { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }
      : { month: 'short', year: 'numeric', timeZone: 'UTC' }

  const parts = new Intl.DateTimeFormat('pt-BR', options).formatToParts(date)
  const month = parts.find((part) => part.type === 'month')?.value ?? ''
  const monthLabel = ptMonthLabel(month)

  if (style === 'monthYear') {
    const year = parts.find((part) => part.type === 'year')?.value ?? ''
    return `${monthLabel} ${year}`
  }

  const day = parts.find((part) => part.type === 'day')?.value ?? ''
  const year = parts.find((part) => part.type === 'year')?.value ?? ''
  return `${day} ${monthLabel} ${year}`
}

function formatEn(date: Date, style: FormatDateStyle): string {
  const options: Intl.DateTimeFormatOptions =
    style === 'full'
      ? { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }
      : { month: 'short', year: 'numeric', timeZone: 'UTC' }

  return new Intl.DateTimeFormat('en-US', options).format(date)
}

/** Frontmatter dates are UTC midnight — always format with `timeZone: 'UTC'`. */
export function formatDate(
  date: Date | string,
  language: InterfaceLanguage,
  { style }: { style: FormatDateStyle },
): string {
  const value = toDate(date)

  if (language === 'pt') {
    return formatPt(value, style)
  }

  return formatEn(value, style)
}
