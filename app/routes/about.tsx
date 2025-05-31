import About from '@content/about.mdx'
import type { Route } from './+types/about'

// biome-ignore lint/correctness/noEmptyPattern: <explanation>
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'About - Daniel Castro - Software Engineer' },
    {
      name: 'description',
      content: "It's all about me.",
    },
  ]
}

export default function AboutPage() {
  return (
    <div className="prose prose-invert mx-auto max-w-3xl px-4 py-8">
      <About />
    </div>
  )
}
