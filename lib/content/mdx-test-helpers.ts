import type { MDXRemoteProps } from 'next-mdx-remote/rsc'
import { compileMDX } from 'next-mdx-remote/rsc'
import { defaultRehypePlugins, defaultRemarkPlugins } from './mdx'
import { mdxComponents } from './mdx-components'

export const testMdxOptions = {
  remarkPlugins: defaultRemarkPlugins,
  rehypePlugins: defaultRehypePlugins,
} as const

export async function compileMdxForTest(
  source: string,
  components: MDXRemoteProps['components'] = mdxComponents,
) {
  return compileMDX({
    source,
    components,
    options: {
      mdxOptions: testMdxOptions,
    },
  })
}
