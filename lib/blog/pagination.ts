export const BLOG_PAGE_SIZE = 12

export type BlogViewMode = 'list' | 'grid'

function firstQueryValue(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0]
  }

  return value
}

export function parseBlogView(
  raw: string | string[] | undefined,
): BlogViewMode {
  const value = firstQueryValue(raw)

  if (value === 'grid') {
    return 'grid'
  }

  return 'list'
}

export function parseBlogPage(raw: string | string[] | undefined): number {
  const value = firstQueryValue(raw)

  if (!value) {
    return 1
  }

  const parsed = Number.parseInt(value, 10)

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1
  }

  return parsed
}

export function getBlogPageCount(
  total: number,
  pageSize = BLOG_PAGE_SIZE,
): number {
  if (total <= 0) {
    return 0
  }

  return Math.ceil(total / pageSize)
}

export function sliceBlogPage<T>(
  items: readonly T[],
  page: number,
  pageSize = BLOG_PAGE_SIZE,
): T[] {
  const start = (page - 1) * pageSize

  return items.slice(start, start + pageSize)
}

export function normalizeBlogPage(page: number, pageCount: number): number {
  if (pageCount <= 0) {
    return 1
  }

  if (page < 1) {
    return 1
  }

  if (page > pageCount) {
    return pageCount
  }

  return page
}

export function buildBlogListingHref(options: {
  page?: number
  view?: BlogViewMode
}): string {
  const params = new URLSearchParams()

  if (options.view === 'grid') {
    params.set('view', 'grid')
  }

  if (options.page !== undefined && options.page > 1) {
    params.set('page', String(options.page))
  }

  const query = params.toString()

  return query ? `/blog?${query}` : '/blog'
}
