'use client'

import { useLayoutEffect, useRef, useState } from 'react'

export type SlidingHighlightBox = {
  x: number
  y: number
  width: number
  height: number
  visible: boolean
}

const hiddenHighlight: SlidingHighlightBox = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  visible: false,
}

export function useSlidingHighlight<T extends HTMLElement = HTMLElement>(
  targetKey: string | null,
) {
  const containerRef = useRef<T>(null)
  const shownRef = useRef(false)
  const [box, setBox] = useState<SlidingHighlightBox>(hiddenHighlight)
  const [instant, setInstant] = useState(true)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    function update() {
      const current = containerRef.current
      const target =
        current && targetKey
          ? current.querySelector<HTMLElement>(
              `[data-highlight-target="${CSS.escape(targetKey)}"]`,
            )
          : null

      if (!current || !target) {
        shownRef.current = false
        setBox((previous) =>
          previous.visible ? { ...previous, visible: false } : previous,
        )
        return
      }

      if (!shownRef.current) {
        setInstant(true)
      }
      shownRef.current = true

      const containerRect = current.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      setBox({
        x: targetRect.left - containerRect.left,
        y: targetRect.top - containerRect.top,
        width: targetRect.width,
        height: targetRect.height,
        visible: true,
      })
    }

    update()

    if (typeof ResizeObserver === 'undefined') {
      return
    }

    const observer = new ResizeObserver(update)
    observer.observe(container)
    for (const target of container.querySelectorAll(
      '[data-highlight-target]',
    )) {
      observer.observe(target)
    }

    return () => observer.disconnect()
  }, [targetKey])

  useLayoutEffect(() => {
    if (!instant) {
      return
    }

    const frame = requestAnimationFrame(() => setInstant(false))
    return () => cancelAnimationFrame(frame)
  }, [instant])

  return { containerRef, box, instant }
}

export function SlidingHighlight({
  box,
  instant,
}: {
  box: SlidingHighlightBox
  instant: boolean
}) {
  return (
    <span
      aria-hidden="true"
      data-header-highlight=""
      className="pointer-events-none absolute top-0 left-0 z-0 rounded-md bg-foreground/[0.06] transition-[transform,width,height,opacity] duration-300 ease-out motion-reduce:transition-none"
      style={{
        width: box.width,
        height: box.height,
        transform: `translate3d(${box.x}px, ${box.y}px, 0)`,
        opacity: box.visible ? 1 : 0,
        ...(instant ? { transition: 'none' } : {}),
      }}
    />
  )
}
