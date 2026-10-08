'use client'

import { useEffect, useState } from 'react'

export function AboutScrollHint({
  targetId,
  label,
}: {
  targetId: string
  label: string
}) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const target = document.getElementById(targetId)
    if (!target) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return
        }
        setVisible(false)
        observer.disconnect()
      },
      { threshold: 0.2 },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [targetId])

  function scrollToTarget() {
    const target = document.getElementById(targetId)
    if (!target) {
      return
    }
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    target.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  return (
    <button
      type="button"
      aria-label={label}
      aria-hidden={visible ? undefined : true}
      tabIndex={visible ? 0 : -1}
      onClick={scrollToTarget}
      className={[
        'fixed bottom-6 left-1/2 z-10 -translate-x-1/2',
        'inline-flex size-11 items-center justify-center rounded-full',
        'border border-border bg-background text-muted shadow-sm',
        'transition-[opacity,transform] duration-200',
        'hover:bg-foreground/5 hover:text-foreground',
        'outline-hidden focus-visible:ring-2 focus-visible:ring-foreground/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        visible ? 'motion-safe:animate-bounce' : '',
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
        <path d="M12 5v14" />
        <path d="m19 12-7 7-7-7" />
      </svg>
    </button>
  )
}
