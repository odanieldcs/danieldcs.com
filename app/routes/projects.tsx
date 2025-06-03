import type { Route } from './+types/projects'

// biome-ignore lint/correctness/noEmptyPattern: <explanation>
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Projects - Daniel Castro - Software Engineer' },
    {
      name: 'description',
      content: 'Explore my projects and contributions.',
    },
  ]
}
export default function Projects() {
  return (
    <main className="flex flex-col h-screen items-center justify-center pt-16 pb-4">
      <p className="leading-6 text-gray-700 dark:text-gray-200 text-center">
        Projects and Contributions page will be available soon!
      </p>
    </main>
  )
}
