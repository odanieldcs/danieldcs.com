import Image from 'next/image'
import Link from 'next/link'
import type { MDXRemoteProps } from 'next-mdx-remote/rsc'
import type { ComponentPropsWithoutRef } from 'react'
import { linkClassName } from '@/lib/link-styles'

const FALLBACK_IMAGE_WIDTH = 800
const FALLBACK_IMAGE_HEIGHT = 450

function joinClasses(...parts: (string | undefined)[]) {
  return parts.filter(Boolean).join(' ')
}

/** Article chrome — reuse on `app/blog/[slug]/page.tsx`. */
export const articleTitleClassName = 'text-h1 font-semibold mb-content-gap'
export const articleDateClassName =
  'mb-content-gap block text-caption text-muted'
export const articleTagsListClassName =
  'mb-section flex list-none flex-wrap gap-inline text-caption text-muted'

function isInternalHref(href: string | undefined): href is string {
  return (
    typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')
  )
}

function toPositiveInt(value: unknown, fallback: number): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function MdxLink({ href, className, ...props }: ComponentPropsWithoutRef<'a'>) {
  const classes = [linkClassName, className].filter(Boolean).join(' ')

  if (isInternalHref(href)) {
    return <Link href={href} className={classes} {...props} />
  }

  return (
    <a
      href={href}
      className={classes}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  )
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
  h1: ({ className, ...props }) => (
    <h1
      className={joinClasses(
        'mt-section mb-content-gap text-h1 font-semibold first:mt-0',
        className,
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={joinClasses(
        'mt-section mb-content-gap text-h2 font-semibold first:mt-0',
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={joinClasses(
        'mt-content-gap mb-content-gap text-h3 font-semibold first:mt-0',
        className,
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }) => (
    <h4
      className={joinClasses(
        'mt-content-gap mb-inline text-h4 font-semibold first:mt-0',
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p
      className={joinClasses('mb-content-gap text-body last:mb-0', className)}
      {...props}
    />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={joinClasses(
        'my-content-gap border-border border-l-2 pl-inline text-body text-muted',
        className,
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul
      className={joinClasses(
        'mb-content-gap list-disc space-y-inline pl-[1.25em] text-body',
        className,
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={joinClasses(
        'mb-content-gap list-decimal space-y-inline pl-[1.25em] text-body',
        className,
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }) => (
    <li className={joinClasses('text-body', className)} {...props} />
  ),
  a: MdxLink,
  img: MdxImage,
  pre: MdxPre,
  code: MdxCode,
}
