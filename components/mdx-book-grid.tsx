import type { ReactNode } from 'react'

/** Single stacked list — reads like prose, not a card mosaic. */
export function MdxBookGrid({ children }: { children: ReactNode }) {
  return (
    <ul className="my-section list-none divide-y divide-border overflow-hidden rounded-lg border border-border p-0">
      {children}
    </ul>
  )
}
