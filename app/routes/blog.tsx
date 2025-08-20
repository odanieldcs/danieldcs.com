import { Link } from 'react-router'

export function meta() {
  return [
    { title: 'Blog - Daniel Castro - Software Engineer' },
    {
      name: 'description',
      content:
        'Explore articles on software engineering, web development, and more.',
    },
  ]
}

export default function Blog() {
  return (
    <main className="flex flex-col h-screen items-center justify-center pt-16 pb-4">
      <p className="leading-6 text-gray-700 dark:text-gray-200 text-center">
        Blog posts, articles, and tutorials from dev to devs.
      </p>
      <ul>
        <li>
          <Link to="/blog/hello-world">Hello World</Link>
        </li>
      </ul>
    </main>
  )
}
