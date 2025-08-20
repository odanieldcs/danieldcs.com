import { MDXContent } from '@/components/mdx-content/mdx-content';
import { pages } from '@/content';
import { useLoaderData } from 'react-router';

export function meta() {
  return [
    { title: 'About - Daniel Castro - Software Engineer' },
    {
      name: 'description',
      content: "It's all about me.",
    },
  ]
}

export async function loader() {
  const page = pages.find(page => page.slug === 'about');

  if (!page) {
    throw new Response('Not found', { status: 404 });
  }

  return { page }
}

export default function AboutPage() {
  const { page } = useLoaderData<typeof loader>();

  return (
    <div className="prose prose-invert mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
      {page.description && (
        <p className="text-xl text-gray-600">{page.description}</p>
      )}
      {page.publishedAt && (
        <time className="text-sm text-gray-500">
          {new Date(page.publishedAt).toLocaleDateString('pt-BR')}
        </time>
      )}
      <div className="prose prose-lg max-w-none">
        <MDXContent code={page.body} />
      </div>
    </div>
  )
}
