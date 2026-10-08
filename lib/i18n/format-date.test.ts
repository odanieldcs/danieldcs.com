import { describe, expect, it } from 'vitest'
import { formatDate } from '@/lib/i18n/format-date'

const utcMidnight = '2026-09-19T00:00:00.000Z'

describe('formatDate', () => {
  it('formats full date in pt from Date and string', () => {
    const date = new Date(utcMidnight)
    expect(formatDate(date, 'pt', { style: 'full' })).toBe('19 set. 2026')
    expect(formatDate(utcMidnight, 'pt', { style: 'full' })).toBe(
      '19 set. 2026',
    )
  })

  it('formats monthYear in pt', () => {
    expect(formatDate(utcMidnight, 'pt', { style: 'monthYear' })).toBe(
      'set. 2026',
    )
  })

  it('formats full date in en from Date and string', () => {
    const date = new Date(utcMidnight)
    expect(formatDate(date, 'en', { style: 'full' })).toBe('Sep 19, 2026')
    expect(formatDate(utcMidnight, 'en', { style: 'full' })).toBe(
      'Sep 19, 2026',
    )
  })

  it('formats monthYear in en', () => {
    expect(formatDate(utcMidnight, 'en', { style: 'monthYear' })).toBe(
      'Sep 2026',
    )
  })

  it('keeps the UTC calendar day when local timezone is behind UTC', () => {
    const original = process.env.TZ
    process.env.TZ = 'America/Sao_Paulo'
    try {
      expect(formatDate(utcMidnight, 'pt', { style: 'full' })).toBe(
        '19 set. 2026',
      )
      expect(formatDate(utcMidnight, 'en', { style: 'full' })).toBe(
        'Sep 19, 2026',
      )
    } finally {
      if (original === undefined) {
        delete process.env.TZ
      } else {
        process.env.TZ = original
      }
    }
  })
})
