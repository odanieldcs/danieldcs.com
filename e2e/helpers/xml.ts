import type { Page } from '@playwright/test'

/** Reads element text from XML. `*` matches the sitemap default namespace. */
export async function xmlTextContents(
  page: Page,
  xml: string,
  tagName: string,
): Promise<string[]> {
  return page.evaluate(
    ({ xml, tagName }) => {
      const document = new DOMParser().parseFromString(xml, 'application/xml')
      const error = document.querySelector('parsererror')
      if (error) {
        throw new Error(error.textContent ?? 'XML parser error')
      }

      return [...document.getElementsByTagNameNS('*', tagName)].flatMap(
        (node) => {
          const text = node.textContent?.trim()
          return text ? [text] : []
        },
      )
    },
    { xml, tagName },
  )
}
