import Image from 'next/image'
import Link from 'next/link'
import type { MDXRemoteProps } from 'next-mdx-remote/rsc'
import type { ComponentPropsWithoutRef } from 'react'

const FALLBACK_IMAGE_WIDTH = 800
const FALLBACK_IMAGE_HEIGHT = 450

function isInternalHref(href: string | undefined): href is string {
  return (
    typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')
  )
}

function toPositiveInt(value: unknown, fallback: number): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function MdxLink({ href, ...props }: ComponentPropsWithoutRef<'a'>) {
  if (isInternalHref(href)) {
    return <Link href={href} {...props} />
  }

  return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
}

function MdxImage({
  src,
  alt,
  width,
  height,
}: ComponentPropsWithoutRef<'img'>) {
  if (typeof src !== 'string' || src.length === 0) {
    return null
  }

  return (
    <Image
      src={src}
      alt={alt ?? ''}
      width={toPositiveInt(width, FALLBACK_IMAGE_WIDTH)}
      height={toPositiveInt(height, FALLBACK_IMAGE_HEIGHT)}
    />
  )
}

function MdxPre({
  className,
  style,
  children,
  ...props
}: ComponentPropsWithoutRef<'pre'>) {
  return (
    <pre className={className} style={style} {...props}>
      {children}
    </pre>
  )
}

function MdxCode({
  className,
  style,
  children,
  ...props
}: ComponentPropsWithoutRef<'code'>) {
  return (
    <code className={className} style={style} {...props}>
      {children}
    </code>
  )
}

export const mdxComponents: NonNullable<MDXRemoteProps['components']> = {
  h1: (props) => <h1 {...props} />,
  h2: (props) => <h2 {...props} />,
  h3: (props) => <h3 {...props} />,
  h4: (props) => <h4 {...props} />,
  p: (props) => <p {...props} />,
  blockquote: (props) => <blockquote {...props} />,
  ul: (props) => <ul {...props} />,
  ol: (props) => <ol {...props} />,
  li: (props) => <li {...props} />,
  a: MdxLink,
  img: MdxImage,
  pre: MdxPre,
  code: MdxCode,
}
