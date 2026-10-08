'use client'

import { useLayoutEffect, useState } from 'react'
import {
  SlidingHighlight,
  useSlidingHighlight,
} from '@/components/layout/sliding-highlight'
import { LanguageSwitch } from '@/components/ui/language-switch'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export function HeaderControls() {
  const [hovered, setHovered] = useState<string | null>(null)
  const { containerRef, box, instant } =
    useSlidingHighlight<HTMLDivElement>(hovered)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    function onMouseOver(event: MouseEvent) {
      if (!(event.target instanceof Element)) {
        return
      }

      const key = event.target
        .closest('[data-highlight-target]')
        ?.getAttribute('data-highlight-target')
      if (key) {
        setHovered(key)
      }
    }

    const clear = () => setHovered(null)
    container.addEventListener('mouseover', onMouseOver)
    container.addEventListener('mouseleave', clear)
    return () => {
      container.removeEventListener('mouseover', onMouseOver)
      container.removeEventListener('mouseleave', clear)
    }
  }, [containerRef])

  return (
    <div
      ref={containerRef}
      data-header-controls=""
      className="relative flex items-center gap-1"
    >
      <SlidingHighlight box={box} instant={instant} />
      <ThemeToggle />
      <LanguageSwitch />
    </div>
  )
}
