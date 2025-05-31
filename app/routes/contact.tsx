import type { Route } from './+types/contact'

// biome-ignore lint/correctness/noEmptyPattern: <explanation>
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Contact - Daniel Castro - Software Engineer' },
    {
      name: 'description',
      content: 'Get in touch with me.',
    },
  ]
}

export default function Contact() {
  return (
    <main className="flex flex-col h-screen items-center justify-center pt-16 pb-4">
      <p className="leading-6 text-gray-700 dark:text-gray-200 text-center">
        Contact page will be available soon!
      </p>
    </main>
  )
}
