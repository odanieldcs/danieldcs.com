import { MDXContent } from '@/components/mdx-content/mdx-content';
import { posts } from '@/content';
import { useLoaderData, type LoaderFunctionArgs } from "react-router";

export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;
  const post = posts.find(post => post.slug === slug);

  if (!post) {
    throw new Response('Not found', { status: 404 });
  }

  return { post }
}

export default function BlogPage() {
  const { post } = useLoaderData<typeof loader>();
  
  return (
    <article className="max-w-4xl mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        {post.description && (
          <p className="text-xl text-gray-600">{post.description}</p>
        )}
        {post.publishedAt && (
          <time className="text-sm text-gray-500">
            {new Date(post.publishedAt).toLocaleDateString('pt-BR')}
          </time>
        )}
      </header>

      <div className="prose prose-lg max-w-none">
        <MDXContent code={post.content} />
      </div>
    </article>
  );
}