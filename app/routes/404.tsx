
export function meta() {
  return [
    { title: 'Page Not Found - Daniel Castro - Software Engineer' },
    {
      name: 'description',
      content: 'The page you are looking for does not exist.',
    },
  ]
}

export default function NotFound() {
  return (
    <main className="flex flex-col h-screen items-center justify-center pt-16 pb-4">
      <p className="leading-6 text-gray-700 dark:text-gray-200 text-center">
        Page not found!
      </p>
    </main>
  )
}
