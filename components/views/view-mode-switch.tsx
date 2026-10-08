'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { useState } from 'react'
import {
  SlidingHighlight,
  useSlidingHighlight,
} from '@/components/layout/sliding-highlight'

export type ListingViewMode = 'list' | 'grid'

const focusClassName = [
  'outline-hidden focus-visible:ring-2 focus-visible:ring-foreground/35',
  'focus-visible:ring-offset-2 focus-visible:ring-offset-background',
].join(' ')

const tooltipClassName = [
  'pointer-events-none absolute top-full left-1/2 z-20 mt-1.5 -translate-x-1/2',
  'whitespace-nowrap rounded-md border border-border bg-background px-2 py-1 text-caption text-foreground shadow-sm',
  'translate-y-0.5 opacity-0 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none',
  'group-hover/viewtip:translate-y-0 group-hover/viewtip:opacity-100',
  'group-focus-visible/viewtip:translate-y-0 group-focus-visible/viewtip:opacity-100',
].join(' ')

const controlClassName = [
  'group/viewtip relative z-10 inline-flex size-8 items-center justify-center rounded-full',
  'transition-colors duration-200',
  focusClassName,
].join(' ')

function toneClassName(active: boolean) {
  return active ? 'text-foreground' : 'text-foreground/80'
}

export function ViewModeSwitch({
  ariaLabel,
  view,
  options,
  idPrefix,
  hrefFor,
  onSelect,
}: {
  ariaLabel: string
  view: ListingViewMode
  options: Array<{ id: ListingViewMode; label: string; icon: ReactNode }>
  idPrefix: string
  hrefFor?: (id: ListingViewMode) => string
  onSelect?: (id: ListingViewMode) => void
}) {
  const [pendingView, setPendingView] = useState<ListingViewMode | null>(null)
  const [trackedView, setTrackedView] = useState(view)
  if (view !== trackedView) {
    setTrackedView(view)
    setPendingView(null)
  }

  const activeView = pendingView ?? view
  const { containerRef, box, instant } =
    useSlidingHighlight<HTMLDivElement>(activeView)

  return (
    // biome-ignore lint/a11y/useSemanticElements: list/grid toggle; fieldset would break the pill layout.
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex w-fit rounded-full border border-border bg-background p-0.5"
    >
      <div ref={containerRef} className="relative inline-flex">
        <SlidingHighlight
          box={box}
          instant={instant}
          radiusClassName="rounded-full"
        />
        {options.map((option) => {
          const pressed = view === option.id
          const highlighted = activeView === option.id
          const tooltipId = `${idPrefix}-${option.id}`
          const className = [controlClassName, toneClassName(highlighted)].join(
            ' ',
          )
          const tooltip = (
            <span id={tooltipId} role="tooltip" className={tooltipClassName}>
              {option.label}
            </span>
          )

          if (hrefFor) {
            return (
              <Link
                key={option.id}
                href={hrefFor(option.id)}
                aria-pressed={pressed}
                aria-label={option.label}
                aria-describedby={tooltipId}
                data-highlight-target={option.id}
                onPointerDown={() => setPendingView(option.id)}
                className={className}
              >
                {option.icon}
                {tooltip}
              </Link>
            )
          }

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={pressed}
              aria-label={option.label}
              aria-describedby={tooltipId}
              data-highlight-target={option.id}
              onPointerDown={() => setPendingView(option.id)}
              onClick={() => onSelect?.(option.id)}
              className={className}
            >
              {option.icon}
              {tooltip}
            </button>
          )
        })}
      </div>
    </div>
  )
}
