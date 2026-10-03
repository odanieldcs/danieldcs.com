import Image from 'next/image'
import { ArrowRightIcon } from '@/components/arrow-right-icon'
import { externalLinkRel } from '@/lib/external-link'

const focusRingClassName = [
  'outline-hidden focus-visible:ring-2 focus-visible:ring-foreground/35',
  'focus-visible:ring-inset focus-visible:ring-offset-0',
].join(' ')

export function MdxBookPick({
  cover,
  href,
  title,
  subtitle,
}: {
  cover: string
  href: string
  title: string
  subtitle?: string
}) {
  const rel = externalLinkRel(href)

  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel={rel}
        className={[
          'group flex items-center gap-4 px-4 py-4 transition-colors sm:gap-5 sm:px-5 sm:py-5',
          'hover:bg-foreground/[0.04]',
          focusRingClassName,
        ].join(' ')}
      >
        <span className="relative aspect-2/3 w-[4.25rem] shrink-0 overflow-hidden rounded-sm shadow-sm ring-1 ring-border/90 sm:w-[5rem]">
          <Image
            src={cover}
            alt=""
            aria-hidden
            fill
            className="object-cover"
            sizes="(min-width: 40rem) 80px, 68px"
            unoptimized
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-lg font-medium leading-snug text-foreground transition-colors group-hover:text-accent sm:text-xl">
            {title}
          </span>
          {subtitle ? (
            <span className="mt-1 block text-caption leading-relaxed text-muted">
              {subtitle}
            </span>
          ) : null}
        </span>
        <span
          aria-hidden
          className="shrink-0 text-foreground/35 transition-colors group-hover:text-accent"
        >
          <ArrowRightIcon />
        </span>
      </a>
    </li>
  )
}
