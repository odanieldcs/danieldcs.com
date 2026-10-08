'use client'

import { useEffect, useState } from 'react'

const SCROLL_THRESHOLD_PX = 320

export function ArticleScrollToTop({ label }: { label: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD_PX)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => {
        const reduceMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)',
        ).matches
        window.scrollTo({
          top: 0,
          behavior: reduceMotion ? 'auto' : 'smooth',
        })
      }}
      className={[
        'fixed bottom-6 right-page z-30',
        'inline-flex size-11 items-center justify-center rounded-full',
        'border border-border bg-background text-foreground shadow-sm',
        'transition-[opacity,transform] duration-200',
        'hover:bg-foreground/5',
        'outline-hidden focus-visible:ring-2 focus-visible:ring-foreground/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        visible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-2 opacity-0',
      ].join(' ')}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    </button>
  )
}
