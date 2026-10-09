import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { ArrowRightIcon } from '@/components/ui/arrow-right-icon'
import { textLinkCtaClassName } from '@/components/ui/text-link-cta'
import { ArticleReadSentinel } from '@/components/views/article-read-sentinel'
import { ArticleScrollToTop } from '@/components/views/article-scroll-to-top'
import { resolveCoverSrc } from '@/lib/content/cover'
import { MdxContent } from '@/lib/content/mdx'
import {
  articleDateClassName,
  articleTitleClassName,
  contentImageClassName,
} from '@/lib/content/mdx-components'
import type { Post } from '@/lib/content/posts'
import { formatDate } from '@/lib/i18n/format-date'
import { getPostCopy } from '@/lib/i18n/pages'
import { localizePath } from '@/lib/i18n/routes'
import { htmlLang, type InterfaceLanguage } from '@/lib/i18n/types'
import { linkClassName } from '@/lib/link-styles'

const COVER_WIDTH = 840
const COVER_HEIGHT = 473

const articleCoverClassName = [
  contentImageClassName,
  'my-content-gap max-w-none md:relative md:left-1/2 md:w-[min(52.5rem,calc(100vw_-_2_*_var(--space-page)))] md:-translate-x-1/2',
].join(' ')

function ContentLanguageNotice({
  slug,
  postLanguage,
  language,
}: {
  slug: string
  postLanguage: InterfaceLanguage
  language: InterfaceLanguage
}) {
  const copy = getPostCopy(language)

  return (
    <p
      role="note"
      className="mt-3 mb-inline text-center text-caption text-muted"
    >
      {copy.onlyAvailableIn[postLanguage]}{' '}
      <Link
        href={localizePath(`/blog/${slug}`, postLanguage)}
        hrefLang={htmlLang[postLanguage]}
        className={linkClassName}
      >
        {copy.readIn[postLanguage]}
      </Link>
    </p>
  )
}

export function PostArticle({
  post,
  language,
}: {
  post: Post
  language: InterfaceLanguage
}) {
  const { frontmatter, content } = post
  const copy = getPostCopy(language)
  const coverSrc = frontmatter.cover
    ? resolveCoverSrc(frontmatter.cover)
    : undefined

  return (
    <>
      <div className="article-frame">
        <Container
          as="article"
          width="article"
          data-analytics-source="post"
          className="pt-10 pb-10 sm:pt-16 sm:pb-16"
        >
          <h1 className={articleTitleClassName}>{frontmatter.title}</h1>
          <time
            className={articleDateClassName}
            dateTime={frontmatter.date.toISOString()}
          >
            {formatDate(frontmatter.date, language, { style: 'full' })}
          </time>
          {coverSrc ? (
            <Image
              src={coverSrc}
              alt={frontmatter.title}
              width={COVER_WIDTH}
              height={COVER_HEIGHT}
              className={articleCoverClassName}
              sizes="(min-width: 48rem) 840px, 100vw"
              loading="eager"
              fetchPriority="high"
            />
          ) : null}
          {frontmatter.language !== language ? (
            <ContentLanguageNotice
              slug={post.slug}
              postLanguage={frontmatter.language}
              language={language}
            />
          ) : null}
          <MdxContent source={content} />
          <ArticleReadSentinel
            key={post.slug}
            slug={post.slug}
            language={language}
          />
          <div className="mt-section flex justify-center">
            <Link
              href={localizePath('/blog', language)}
              className={textLinkCtaClassName}
            >
              <span className="-scale-x-100">
                <ArrowRightIcon />
              </span>
              {copy.backToBlog}
            </Link>
          </div>
        </Container>
      </div>
      <ArticleScrollToTop label={copy.backToTop} />
    </>
  )
}
