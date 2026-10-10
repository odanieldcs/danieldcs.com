import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { InterfaceLanguageProvider } from '@/components/interface-language-provider'
import {
  isInternalPageNavigation,
  NavigationProgress,
} from './navigation-progress'

const here = 'http://localhost:3000/blog'

const navigation = vi.hoisted(() => ({
  pathname: '/',
  animateNext: false,
}))

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('@/components/layout/page-enter', () => ({
  willAnimateNextEnter: () => navigation.animateNext,
}))

beforeEach(() => {
  navigation.pathname = '/'
  navigation.animateNext = false
  vi.stubGlobal('matchMedia', ((query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia)
})

afterEach(() => {
  cleanup()
  document.body.replaceChildren()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

function renderProgress() {
  return render(
    <InterfaceLanguageProvider language="pt">
      <NavigationProgress />
    </InterfaceLanguageProvider>,
  )
}

function clickAbout() {
  const anchor = document.createElement('a')
  anchor.href = '/about'
  document.body.append(anchor)
  anchor.addEventListener('click', (event) => event.preventDefault())
  anchor.click()
  anchor.remove()
}

function installAnimationFrames() {
  const queued = new Map<number, FrameRequestCallback>()
  let nextId = 1
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    const id = nextId
    nextId += 1
    queued.set(id, callback)
    return id
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => {
    queued.delete(id)
  })
  return () => {
    const pending = [...queued.values()]
    queued.clear()
    act(() => {
      for (const callback of pending) callback(0)
    })
  }
}

function mountPageEnter(playState: AnimationPlayState) {
  const enter = document.createElement('div')
  enter.dataset.pageEnter = ''
  enter.className = 'motion-safe:animate-page-in'
  enter.getAnimations = () =>
    [{ animationName: 'page-in', playState }] as unknown as Animation[]
  document.body.append(enter)
  return enter
}

function commitRoute(
  view: ReturnType<typeof renderProgress>,
  pathname: string,
) {
  navigation.pathname = pathname
  view.rerender(
    <InterfaceLanguageProvider language="pt">
      <NavigationProgress />
    </InterfaceLanguageProvider>,
  )
}

test('tracks another internal page and a new search', () => {
  expect(isInternalPageNavigation('/about', here)).toBe(true)
  expect(isInternalPageNavigation('/blog?page=2', here)).toBe(true)
  expect(
    isInternalPageNavigation(
      'http://localhost:3000/en/community',
      'http://localhost:3000/en',
    ),
  ).toBe(true)
})

test('ignores the current url, hash-only jumps, and other sites', () => {
  expect(isInternalPageNavigation('/blog', here)).toBe(false)
  expect(isInternalPageNavigation('/blog#logs', here)).toBe(false)
  expect(isInternalPageNavigation('https://linkedin.com', here)).toBe(false)
})

test('shows the bar on click and keeps the message until the page has been loading for one second', () => {
  vi.useFakeTimers()
  navigation.animateNext = true
  renderProgress()

  act(() => {
    clickAbout()
  })

  expect(screen.queryByRole('status')).toBeNull()
  expect(document.querySelector('[data-phase="loading"]')).not.toBeNull()

  act(() => {
    vi.advanceTimersByTime(999)
  })
  expect(screen.queryByRole('status')).toBeNull()

  act(() => {
    vi.advanceTimersByTime(1)
  })
  expect(screen.getByRole('status').textContent).toContain(
    'O conteúdo está sendo carregado',
  )
})

test('hides the bar when the entering page finishes fading in', () => {
  navigation.animateNext = true
  const flushFrame = installAnimationFrames()
  const view = renderProgress()

  act(() => {
    clickAbout()
  })

  const enter = mountPageEnter('running')
  commitRoute(view, '/about')
  flushFrame()

  expect(screen.queryByRole('status')).toBeNull()
  expect(document.querySelector('[data-phase="loading"]')).not.toBeNull()

  act(() => {
    const event = new Event('animationend')
    Object.defineProperty(event, 'animationName', { value: 'page-in' })
    enter.dispatchEvent(event)
  })

  expect(screen.queryByRole('status')).toBeNull()
  expect(document.querySelector('[data-phase="complete"]')).not.toBeNull()
})

test('settles on the next frame when the template does not remount', () => {
  navigation.animateNext = true
  const flushFrame = installAnimationFrames()
  const view = renderProgress()

  act(() => {
    clickAbout()
  })

  mountPageEnter('finished')
  commitRoute(view, '/blog/postgresql-e-pgadmin-com-docker-compose')

  expect(document.querySelector('[data-phase="loading"]')).not.toBeNull()

  flushFrame()

  expect(document.querySelector('[data-phase="loading"]')).toBeNull()
  expect(document.querySelector('[data-phase="complete"]')).not.toBeNull()
})

test('keeps a fast navigation quiet when the page will not fade', () => {
  vi.useFakeTimers()
  renderProgress()

  act(() => {
    clickAbout()
  })

  expect(screen.queryByRole('status')).toBeNull()
  expect(document.querySelector('[data-phase="loading"]')).toBeNull()

  act(() => {
    vi.advanceTimersByTime(99)
  })

  expect(document.querySelector('[data-phase="loading"]')).toBeNull()
})
