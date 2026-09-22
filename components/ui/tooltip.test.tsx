import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { Tooltip } from './tooltip'

afterEach(() => {
  cleanup()
})

test('links the tooltip to the trigger and shows it on hover and keyboard focus', () => {
  render(
    <Tooltip label="Dark mode">
      {(tooltipId) => (
        <button
          type="button"
          className="peer"
          aria-describedby={tooltipId}
          aria-label="Dark mode"
        >
          icon
        </button>
      )}
    </Tooltip>,
  )

  const tooltip = screen.getByRole('tooltip')
  const trigger = screen.getByRole('button', { name: 'Dark mode' })

  expect(tooltip.textContent).toBe('Dark mode')
  expect(trigger.getAttribute('aria-describedby')).toBe(tooltip.id)
  expect(tooltip.className).toContain('invisible')
  expect(tooltip.className).toContain('peer-hover:visible')
  expect(tooltip.className).toContain('peer-focus-visible:visible')
  expect(tooltip.className).toContain('left-1/2')
  expect(tooltip.className).not.toContain('peer-focus:visible')
})

test('can align to the end so a trailing control stays on screen', () => {
  render(
    <Tooltip label="Mudar para português" align="end">
      {(tooltipId) => (
        <button type="button" className="peer" aria-describedby={tooltipId}>
          icon
        </button>
      )}
    </Tooltip>,
  )

  const tooltip = screen.getByRole('tooltip')
  expect(tooltip.className).toContain('right-0')
  expect(tooltip.className).not.toContain('left-1/2')
})
