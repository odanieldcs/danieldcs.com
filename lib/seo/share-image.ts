import type { StaticImageData } from 'next/image'
import { resolveCoverSrc } from '@/lib/content/cover'
import { absoluteSiteUrl } from '@/lib/site'

export type PostShareImage = {
  url: string
  width?: number
  height?: number
}

export function resolvePostShareImage(
  cover: string | undefined,
  fallbackImage: StaticImageData,
): PostShareImage {
  if (cover) {
    return { url: resolveCoverSrc(cover) }
  }

  return {
    url: fallbackImage.src,
    width: fallbackImage.width,
    height: fallbackImage.height,
  }
}

export function absolutePostShareImageUrl(image: PostShareImage): string {
  if (image.url.startsWith('http://') || image.url.startsWith('https://')) {
    return image.url
  }

  return absoluteSiteUrl(image.url)
}
