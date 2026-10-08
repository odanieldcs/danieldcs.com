import Image from 'next/image'
import Link from 'next/link'
import type { MDXRemoteProps } from 'next-mdx-remote/rsc'
import {
  type ComponentPropsWithoutRef,
  isValidElement,
  type ReactNode,
} from 'react'
import { MdxBookGrid } from '@/components/mdx/mdx-book-grid'
import { MdxBookPick } from '@/components/mdx/mdx-book-pick'
import { externalLinkRel } from '@/lib/external-link'
import { linkClassName } from '@/lib/link-styles'

function containsShikiLine(node: ReactNode): boolean {
  if (!node) {
    return false
  }
  if (Array.isArray(node)) {
    return node.some(containsShikiLine)
  }
  if (!isValidElement(node)) {
    return false
  }
  const props = node.props as { className?: string; children?: ReactNode }
  if (typeof props.className === 'string' && /\bline\b/.test(props.className)) {
    return true
  }
  return containsShikiLine(props.children)
}

const FALLBACK_IMAGE_WIDTH = 800
const FALLBACK_IMAGE_HEIGHT = 450

/** Responsive content images — reuse on blog cover (`app/blog/[slug]/page.tsx`). */
export const contentImageClassName = 'h-auto w-full rounded-md'

const readingCoverImageClassName =
  'h-auto w-[6.5rem] max-w-full rounded-sm ring-1 ring-border'

function joinClasses(...parts: (string | undefined)[]) {
  return parts.filter(Boolean).join(' ')
}

/** Article chrome — reuse on `app/blog/[slug]/page.tsx`. */
export const articleTitleClassName =
  'text-center text-h1 font-semibold mb-2'
export const articleDateClassName =
  'mb-content-gap block text-center text-base font-semibold text-foreground/55'

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

  const externalHref = typeof href === 'string' ? href : ''

  return (
    <a
      href={href}
      className={classes}
      target="_blank"
      rel={externalLinkRel(externalHref)}
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

  const lowerSrc = src.toLowerCase()
  const unoptimized =
    lowerSrc.endsWith('.gif') || lowerSrc.includes('/media/reading/')

  if (lowerSrc.includes('/media/reading/')) {
    return (
      <Image
        src={src}
        alt={alt ?? ''}
        width={104}
        height={160}
        className={readingCoverImageClassName}
        sizes="104px"
        unoptimized
      />
    )
  }

  if (lowerSrc.endsWith('.svg')) {
    return (
      <span className="inline-block rounded-md bg-white p-2">
        {/* biome-ignore lint/performance/noImgElement: SVG diagrams need a native img on a light plate in dark mode. */}
        <img
          src={src}
          alt={alt ?? ''}
          className={contentImageClassName}
          width={toPositiveInt(width, FALLBACK_IMAGE_WIDTH)}
          height={toPositiveInt(height, FALLBACK_IMAGE_HEIGHT)}
        />
      </span>
    )
  }

  return (
    <Image
      src={src}
      alt={alt ?? ''}
      width={toPositiveInt(width, FALLBACK_IMAGE_WIDTH)}
      height={toPositiveInt(height, FALLBACK_IMAGE_HEIGHT)}
      className={contentImageClassName}
      sizes="(min-width: 48rem) 42rem, 100vw"
      unoptimized={unoptimized}
    />
  )
}

const codeBlockPreClassName = [
  'my-content-gap overflow-x-auto font-mono text-code leading-normal',
].join(' ')

const inlineCodeClassName = [
  'rounded-sm bg-muted/15 px-1.5 py-0.5',
  'font-mono text-code align-baseline',
].join(' ')

const tableCellClassName = 'border border-border px-inline py-1 text-body'

function MdxPre({
  className,
  style,
  children,
  ...props
}: ComponentPropsWithoutRef<'pre'>) {
  return (
    <pre
      className={joinClasses(codeBlockPreClassName, className)}
      style={style}
      {...props}
    >
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
  const isFence =
    (typeof className === 'string' && /\blanguage-/.test(className)) ||
    containsShikiLine(children)

  if (isFence) {
    return (
      <code className={joinClasses('block text-code', className)} {...props}>
        {children}
      </code>
    )
  }

  return (
    <code className={joinClasses(inlineCodeClassName, className)} {...props}>
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
  MdxFigure: ({ className, ...props }) => (
    <figure className={joinClasses('my-content-gap', className)} {...props} />
  ),
  MdxFigcaption: ({ className, ...props }) => (
    <figcaption
      className={joinClasses('text-caption text-muted [&_p]:mb-0', className)}
      {...props}
    />
  ),
  table: ({ className, ...props }) => (
    <div className="my-content-gap overflow-x-auto">
      <table
        className={joinClasses('w-full border-collapse text-body', className)}
        {...props}
      />
    </div>
  ),
  th: ({ className, ...props }) => (
    <th
      className={joinClasses(`${tableCellClassName} text-left`, className)}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td className={joinClasses(tableCellClassName, className)} {...props} />
  ),
  pre: MdxPre,
  code: MdxCode,
  BookPick: MdxBookPick,
  BookGrid: MdxBookGrid,
}
