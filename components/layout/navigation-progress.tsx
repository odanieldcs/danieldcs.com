'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useUiDictionary } from '@/components/interface-language-provider'
import {
  LoadingBar,
  LoadingStatus,
} from '@/components/layout/loading-indicator'
import { willAnimateNextEnter } from '@/components/layout/page-enter'

const SHOW_AFTER_MS = 100
const MESSAGE_AFTER_MS = 1000
const HIDE_AFTER_MS = 320
const ENTER_HOLD_MS = 400

type Phase = 'idle' | 'loading' | 'complete'
type TimerRef = { current: number | null }

export function isInternalPageNavigation(
  href: string,
  currentHref: string,
): boolean {
  const next = new URL(href, currentHref)
  const current = new URL(currentHref)
  if (next.origin !== current.origin) return false
  return next.pathname !== current.pathname || next.search !== current.search
}

function clearTimer(timerRef: TimerRef) {
  if (timerRef.current === null) return
  window.clearTimeout(timerRef.current)
  timerRef.current = null
}

function navigationFadesIn() {
  return (
    willAnimateNextEnter() &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function hasRunningPageIn(enter: Element) {
  return enter.getAnimations().some((animation) => {
    return (
      'animationName' in animation &&
      animation.animationName === 'page-in' &&
      animation.playState === 'running'
    )
  })
}

function NavigationProgressIndicator() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const dictionary = useUiDictionary()
  const routeKey = `${pathname}?${searchParams.toString()}`
  const [phase, setPhase] = useState<Phase>('idle')
  const [showMessage, setShowMessage] = useState(false)
  const pendingRef = useRef(false)
  const visibleRef = useRef(false)
  const showTimerRef = useRef<number | null>(null)
  const messageTimerRef = useRef<number | null>(null)
  const hideTimerRef = useRef<number | null>(null)
  const holdTimerRef = useRef<number | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: routeKey is the commit signal; the effect reads refs
  useEffect(() => {
    if (!pendingRef.current) return

    const wasVisible = visibleRef.current
    clearTimer(showTimerRef)

    let cancelled = false

    const settle = () => {
      if (cancelled) return
      cancelled = true
      pendingRef.current = false
      visibleRef.current = false
      clearTimer(holdTimerRef)
      clearTimer(messageTimerRef)
      setShowMessage(false)
      if (!wasVisible) return

      setPhase('complete')
      hideTimerRef.current = window.setTimeout(() => {
        setPhase('idle')
      }, HIDE_AFTER_MS)
    }

    if (!wasVisible || !navigationFadesIn()) {
      settle()
      return
    }

    let detach = () => {}
    const frame = window.requestAnimationFrame(() => {
      if (cancelled) return
      const enter = document.querySelector('[data-page-enter]')
      if (!(enter instanceof HTMLElement) || !hasRunningPageIn(enter)) {
        settle()
        return
      }

      const onEnd = (event: AnimationEvent) => {
        if (event.target !== enter || event.animationName !== 'page-in') {
          return
        }
        settle()
      }
      enter.addEventListener('animationend', onEnd)
      detach = () => enter.removeEventListener('animationend', onEnd)
      holdTimerRef.current = window.setTimeout(settle, ENTER_HOLD_MS)
    })

    return () => {
      cancelled = true
      window.cancelAnimationFrame(frame)
      detach()
      clearTimer(holdTimerRef)
    }
  }, [routeKey])

  useEffect(() => {
    const begin = () => {
      clearTimer(hideTimerRef)
      clearTimer(holdTimerRef)
      pendingRef.current = true
      setShowMessage(false)
      clearTimer(showTimerRef)
      clearTimer(messageTimerRef)

      if (navigationFadesIn()) {
        visibleRef.current = true
        setPhase('loading')
      } else {
        showTimerRef.current = window.setTimeout(() => {
          visibleRef.current = true
          setPhase('loading')
        }, SHOW_AFTER_MS)
      }

      messageTimerRef.current = window.setTimeout(() => {
        setShowMessage(true)
      }, MESSAGE_AFTER_MS)
    }

    const onClick = (event: MouseEvent) => {
      if (event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return
      }
      if (!(event.target instanceof Element)) return
      const anchor = event.target.closest('a')
      if (!anchor?.href) return
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return
      if (!isInternalPageNavigation(anchor.href, window.location.href)) return
      begin()
    }

    document.addEventListener('click', onClick)
    window.addEventListener('popstate', begin)
    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('popstate', begin)
      clearTimer(showTimerRef)
      clearTimer(messageTimerRef)
      clearTimer(hideTimerRef)
      clearTimer(holdTimerRef)
    }
  }, [])

  if (phase === 'idle') return null

  return (
    <>
      <LoadingBar phase={phase} />
      {showMessage ? (
        <LoadingStatus label={dictionary.navigation.loading} />
      ) : null}
    </>
  )
}

export function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressIndicator />
    </Suspense>
  )
}
