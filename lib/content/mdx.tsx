import { MDXRemote, type MDXRemoteProps } from 'next-mdx-remote/rsc'

type MdxOptions = NonNullable<
  NonNullable<MDXRemoteProps['options']>['mdxOptions']
>

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
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: remarkPlugins ?? [],
          rehypePlugins: rehypePlugins ?? [],
        },
      }}
    />
  )
}
