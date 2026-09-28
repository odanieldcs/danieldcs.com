import rehypeShiki from '@shikijs/rehype'
import { MDXRemote, type MDXRemoteProps } from 'next-mdx-remote/rsc'
import { cache } from 'react'
import remarkGfm from 'remark-gfm'
import { mdxComponents } from './mdx-components'
import { prepareMdxSource } from './prepare-mdx-source'
import { remarkMdxHtmlComponents } from './remark-mdx-html-components'
import { shikiTransformers } from './shiki-transformers'

const preparedMdxSource = cache(prepareMdxSource)

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

export const defaultRemarkPlugins = [
  remarkGfm,
  remarkMdxHtmlComponents,
] satisfies MdxOptions['remarkPlugins']

export const defaultRehypePlugins = [
  shikiRehypePlugin,
] satisfies MdxOptions['rehypePlugins']

const defaultMdxRemoteOptions = {
  mdxOptions: {
    remarkPlugins: defaultRemarkPlugins,
    rehypePlugins: defaultRehypePlugins,
  },
} satisfies MDXRemoteProps['options']

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
  const hasExtraPlugins =
    (remarkPlugins?.length ?? 0) > 0 || (rehypePlugins?.length ?? 0) > 0

  return (
    <MDXRemote
      source={preparedMdxSource(source)}
      components={{ ...mdxComponents, ...components }}
      options={
        hasExtraPlugins
          ? {
              mdxOptions: {
                remarkPlugins: [
                  ...defaultRemarkPlugins,
                  ...(remarkPlugins ?? []),
                ],
                rehypePlugins: [
                  ...defaultRehypePlugins,
                  ...(rehypePlugins ?? []),
                ],
              },
            }
          : defaultMdxRemoteOptions
      }
    />
  )
}
