import rehypeShiki from '@shikijs/rehype'
import { MDXRemote, type MDXRemoteProps } from 'next-mdx-remote/rsc'
import { mdxComponents } from './mdx-components'
import { shikiTransformers } from './shiki-transformers'

type MdxOptions = NonNullable<
  NonNullable<MDXRemoteProps['options']>['mdxOptions']
>

type RehypePlugins = NonNullable<MdxOptions['rehypePlugins']>

export const shikiRehypePlugin = [
  rehypeShiki,
  {
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    transformers: shikiTransformers,
  },
] satisfies RehypePlugins[number]

export type MdxContentProps = {
  source: string
  components?: MDXRemoteProps['components']
  remarkPlugins?: MdxOptions['remarkPlugins']
  rehypePlugins?: MdxOptions['rehypePlugins']
}

export function MdxContent({
  source,
  components,
  remarkPlugins,
  rehypePlugins,
}: MdxContentProps) {
  return (
    <MDXRemote
      source={source}
      components={{ ...mdxComponents, ...components }}
      options={{
        mdxOptions: {
          remarkPlugins: remarkPlugins ?? [],
          rehypePlugins: [shikiRehypePlugin, ...(rehypePlugins ?? [])],
        },
      }}
    />
  )
}
