'use client'

import { type ReactNode, useEffect, useState } from 'react'

let seenFirstMount = false

export function willAnimateNextEnter() {
  return seenFirstMount
}

export function PageEnter({ children }: { children: ReactNode }) {
  const [animate] = useState(seenFirstMount)

  useEffect(() => {
    seenFirstMount = true
  }, [])

  return (
    <div
      data-page-enter
      className={animate ? 'motion-safe:animate-page-in' : undefined}
    >
      {children}
    </div>
  )
}
