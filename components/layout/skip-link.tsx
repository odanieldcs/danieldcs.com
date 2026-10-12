'use client'

import type { MouseEvent } from 'react'
import { useUiDictionary } from '@/components/interface-language-provider'

// not-sr-only sets position: static and fights with fixed. Reset the clip on focus.
const skipLinkClassName = [
  'sr-only fixed z-50 bg-background text-sm font-medium text-foreground',
  'outline-hidden focus-visible:ring-2 focus-visible:ring-foreground/35',
  'focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  'focus-visible:fixed focus-visible:top-4 focus-visible:left-4',
  'focus-visible:m-0 focus-visible:h-auto focus-visible:w-auto',
  'focus-visible:overflow-visible focus-visible:px-4 focus-visible:py-2',
  'focus-visible:whitespace-normal focus-visible:rounded-md',
  'focus-visible:[clip-path:none]',
].join(' ')

export function SkipLink() {
  const { skipLink } = useUiDictionary()

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    const mains = document.querySelectorAll('main')
    const main = mains.length === 1 ? mains[0] : undefined
    if (!main) {
      return
    }

    event.preventDefault()
    main.tabIndex = -1
    main.focus()
  }

  return (
    <nav aria-label={skipLink.navAriaLabel}>
      {/* biome-ignore lint/a11y/useValidAnchor: click focuses the only main; views do not each carry an id. */}
      <a href="#conteudo" className={skipLinkClassName} onClick={onClick}>
        {skipLink.label}
      </a>
    </nav>
  )
}
