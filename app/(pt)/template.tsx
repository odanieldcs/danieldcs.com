import type { ReactNode } from 'react'

export default function Template({ children }: { children: ReactNode }) {
  return <div className="motion-safe:animate-page-in">{children}</div>
}
