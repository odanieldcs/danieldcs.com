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
  vi.stubGlobal(
    'matchMedia',
    (query: string) =>
      ({
        matches: false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }) as MediaQueryList,
  )
})

afterEach(() => {
  cleanup()
  document.body.replaceChildren()
  vi.useRealTimers()
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
  const view = renderProgress()

  act(() => {
    clickAbout()
  })

  const enter = document.createElement('div')
  enter.dataset.pageEnter = ''
  enter.className = 'motion-safe:animate-page-in'
  document.body.append(enter)
  navigation.pathname = '/about'
  view.rerender(
    <InterfaceLanguageProvider language="pt">
      <NavigationProgress />
    </InterfaceLanguageProvider>,
  )

  expect(screen.queryByRole('status')).toBeNull()

  act(() => {
    const event = new Event('animationend')
    Object.defineProperty(event, 'animationName', { value: 'page-in' })
    enter.dispatchEvent(event)
  })

  expect(screen.queryByRole('status')).toBeNull()
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
