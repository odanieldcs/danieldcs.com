export type RssChannel = {
  title: string
  link: string
  description: string
  language: string
  lastBuildDate: Date
  selfLink: string
}

export type RssItem = {
  title: string
  link: string
  guid: string
  description: string
  pubDate: Date
  categories: readonly string[]
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function element(name: string, value: string): string {
  return `<${name}>${escapeXml(value)}</${name}>`
}

function renderItem(item: RssItem): string {
  const lines = [
    '  <item>',
    `    ${element('title', item.title)}`,
    `    ${element('link', item.link)}`,
    `    <guid isPermaLink="true">${escapeXml(item.guid)}</guid>`,
    `    ${element('description', item.description)}`,
    `    ${element('pubDate', item.pubDate.toUTCString())}`,
  ]

  for (const category of item.categories) {
    lines.push(`    ${element('category', category)}`)
  }

  lines.push('  </item>')
  return lines.join('\n')
}

/** RSS 2.0 document. Dates come from the given values; this never reads the clock. */
export function buildRssFeed(
  channel: RssChannel,
  items: readonly RssItem[],
): string {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '<channel>',
    `  ${element('title', channel.title)}`,
    `  ${element('link', channel.link)}`,
    `  ${element('description', channel.description)}`,
    `  ${element('language', channel.language)}`,
    `  ${element('lastBuildDate', channel.lastBuildDate.toUTCString())}`,
    `  <atom:link href="${escapeXml(channel.selfLink)}" rel="self" type="application/rss+xml"/>`,
  ]

  for (const item of items) {
    lines.push(renderItem(item))
  }

  lines.push('</channel>', '</rss>')
  return `${lines.join('\n')}\n`
}
