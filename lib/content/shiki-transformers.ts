import {
  parseMetaHighlightString,
  transformerRemoveLineBreak,
} from '@shikijs/transformers'

type ShikiTransformer = ReturnType<typeof transformerRemoveLineBreak>

const LANGUAGE_LABELS: Record<string, string> = {
  typescript: 'ts',
  ts: 'ts',
  tsx: 'tsx',
  javascript: 'js',
  js: 'js',
  shell: 'bash',
  sh: 'bash',
  bash: 'bash',
  json: 'json',
}

function languageLabel(lang: string): string {
  return LANGUAGE_LABELS[lang] ?? lang
}

const highlightMetaSymbol = Symbol('highlighted-lines')

/** Meta `{1,3-5}` → `data-highlight="true"` (same API as Shiki meta highlight). */
export function transformerLineHighlightDataAttr(): ShikiTransformer {
  return {
    name: 'line-highlight-data-attr',
    line(node, lineNumber) {
      if (!this.options.meta?.__raw) {
        return
      }
      const meta = this.meta as Record<symbol, number[] | null | undefined>
      meta[highlightMetaSymbol] ??= parseMetaHighlightString(
        this.options.meta.__raw,
      )
      const highlightedLines = meta[highlightMetaSymbol] ?? []
      if (highlightedLines.includes(lineNumber)) {
        node.properties.dataHighlight = 'true'
      }
    },
  }
}

/** Line numbers via `data-line-number` + CSS `::before` (Kent-style). */
export function transformerLineNumberDataAttr(): ShikiTransformer {
  return {
    name: 'line-number-data-attr',
    line(node, lineNumber) {
      node.properties.dataLineNumber = String(lineNumber)
    },
  }
}

export function transformerDataLanguage(): ShikiTransformer {
  return {
    name: 'data-language',
    pre(node) {
      node.properties.dataLineNumbers = 'true'
      const lang = this.options.lang ?? ''
      const label = languageLabel(lang)
      if (label) {
        node.properties.dataLanguage = label
      }
    },
  }
}

/** Drop Shiki theme backgrounds so DS tokens in CSS control the container. */
export function transformerStripInlineBackground(): ShikiTransformer {
  return {
    name: 'strip-inline-background',
    pre(node) {
      const style = node.properties.style
      if (typeof style !== 'string') {
        return
      }
      node.properties.style = style
        .replace(/background-color:[^;]+;?/gi, '')
        .replace(/--shiki-dark-bg:[^;]+;?/gi, '')
    },
    code(node) {
      const style = node.properties.style
      if (typeof style !== 'string') {
        return
      }
      node.properties.style = style.replace(/background-color:[^;]+;?/gi, '')
    },
  }
}

export const shikiTransformers: ShikiTransformer[] = [
  transformerLineHighlightDataAttr(),
  transformerLineNumberDataAttr(),
  transformerRemoveLineBreak(),
  transformerDataLanguage(),
  transformerStripInlineBackground(),
]
