import { type JsonLdDocument, serializeJsonLd } from '@/lib/seo/json-ld'

type JsonLdProps = {
  data: JsonLdDocument
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD via serializeJsonLd.
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  )
}
