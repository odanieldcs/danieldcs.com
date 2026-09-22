import { type ReactNode, useId } from 'react'

type TooltipAlign = 'center' | 'end'

type TooltipProps = {
  label: string
  align?: TooltipAlign
  children: (tooltipId: string) => ReactNode
}

const alignClassName: Record<TooltipAlign, string> = {
  center: 'left-1/2 -translate-x-1/2',
  end: 'right-0',
}

const tooltipClassName = [
  'pointer-events-none invisible absolute top-full z-10 mt-1',
  'whitespace-nowrap rounded-md border border-border bg-background px-2 py-1 text-caption text-foreground shadow-sm',
  'peer-hover:visible peer-focus-visible:visible',
].join(' ')

/** CSS tooltip. The trigger must include the `peer` class and `aria-describedby={tooltipId}`. */
export function Tooltip({ label, align = 'center', children }: TooltipProps) {
  const tooltipId = useId()

  return (
    <div className="relative inline-flex">
      {children(tooltipId)}
      <span
        id={tooltipId}
        role="tooltip"
        className={`${tooltipClassName} ${alignClassName[align]}`}
      >
        {label}
      </span>
    </div>
  )
}
