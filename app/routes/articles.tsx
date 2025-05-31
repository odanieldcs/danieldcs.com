import type { Route } from './+types/articles'

// biome-ignore lint/correctness/noEmptyPattern: <explanation>
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Articles - Daniel Castro - Software Engineer' },
    {
      name: 'description',
      content:
        'Explore articles on software engineering, web development, and more.',
    },
  ]
}

export default function Articles() {
  return (
    <main className="flex flex-col h-screen items-center justify-center pt-16 pb-4">
      <p className="leading-6 text-gray-700 dark:text-gray-200 text-center">
        Articles will be available soon!
      </p>
    </main>
  )
}
