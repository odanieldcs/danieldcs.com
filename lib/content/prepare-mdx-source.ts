const ALLOWED_HTML_TAG = /^<\/?(figure|figcaption)\b[^>]*>/i
const FENCE_LINE_PREFIX = /^(`{3,}|~{3,})/

function escapeAngleBracketsInProse(text: string): string {
  let result = ''
  let index = 0

  while (index < text.length) {
    if (text[index] === '<') {
      if (index > 0 && text[index - 1] === '\\') {
        result += '<'
        index += 1
        continue
      }

      const rest = text.slice(index)
      const allowedMatch = rest.match(ALLOWED_HTML_TAG)
      if (allowedMatch) {
        result += allowedMatch[0]
        index += allowedMatch[0].length
        continue
      }
      result += '\\<'
      index += 1
      continue
    }

    result += text[index]
    index += 1
  }

  return result
}

function escapeProseLine(line: string): string {
  const segments = line.split(/(`+[^`]*`+)/)
  return segments
    .map((segment, segmentIndex) =>
      segmentIndex % 2 === 1 ? segment : escapeAngleBracketsInProse(segment),
    )
    .join('')
}

function toggleFence(
  line: string,
  inFence: boolean,
  fenceMarker: string,
): { inFence: boolean; fenceMarker: string } {
  const fenceMatch = line.match(FENCE_LINE_PREFIX)
  if (!fenceMatch) {
    return { inFence, fenceMarker }
  }

  const marker = fenceMatch[1] ?? ''
  if (!inFence) {
    return { inFence: true, fenceMarker: marker }
  }

  if (marker[0] === fenceMarker[0] && marker.length >= fenceMarker.length) {
    return { inFence: false, fenceMarker: '' }
  }

  return { inFence, fenceMarker }
}

/** Escapes raw `<` in prose so MDX does not treat placeholders as JSX. */
export function prepareMdxSource(source: string): string {
  let inFence = false
  let fenceMarker = ''

  return source
    .split('\n')
    .map((line) => {
      const nextFence = toggleFence(line, inFence, fenceMarker)
      inFence = nextFence.inFence
      fenceMarker = nextFence.fenceMarker

      if (inFence) {
        return line
      }

      return escapeProseLine(line)
    })
    .join('\n')
}
