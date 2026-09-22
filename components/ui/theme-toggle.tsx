'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from '@/components/button'
import { useUiDictionary } from '@/components/interface-language-provider'
import { Tooltip } from '@/components/ui/tooltip'

const iconButtonClassName = 'peer min-w-11 px-0'

const iconProps = {
  'aria-hidden': true,
  viewBox: '0 0 24 24',
  className: 'size-5',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

function SunIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v1.5M12 19.5V21M4.2 12H3M21 12h-1.2M5.6 5.6l1.1 1.1M17.3 17.3l1.1 1.1M18.4 5.6l-1.1 1.1M6.7 17.3 5.6 18.4" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg {...iconProps}>
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
    </svg>
  )
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const { theme } = useUiDictionary()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        className="min-w-11 px-0"
        disabled
        aria-label={theme.toggle}
      />
    )
  }

  const isDark = resolvedTheme === 'dark'
  const label = isDark ? theme.lightMode : theme.darkMode

  return (
    <Tooltip label={label}>
      {(tooltipId) => (
        <Button
          variant="ghost"
          className={iconButtonClassName}
          aria-describedby={tooltipId}
          aria-label={label}
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </Button>
      )}
    </Tooltip>
  )
}
