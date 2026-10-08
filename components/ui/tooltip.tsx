import { type ReactNode, useId } from 'react'

type TooltipAlign = 'center' | 'end'

type TooltipProps = {
  label: string
  align?: TooltipAlign
  className?: string
  children: (tooltipId: string) => ReactNode
}

const alignClassName: Record<TooltipAlign, string> = {
  center: 'left-1/2 -translate-x-1/2',
  end: 'right-0',
}

const tooltipClassName = [
  'pointer-events-none absolute top-full z-10 mt-1.5',
  'whitespace-nowrap rounded-md border border-border bg-background px-2 py-1 text-caption text-foreground shadow-sm',
  'translate-y-0.5 opacity-0 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none',
  'peer-hover:translate-y-0 peer-hover:opacity-100 peer-focus-visible:translate-y-0 peer-focus-visible:opacity-100',
].join(' ')

export function tooltipPopupClassName(align: TooltipAlign = 'center') {
  return `${tooltipClassName} ${alignClassName[align]}`
}

/** CSS tooltip. The trigger must include the `peer` class and `aria-describedby={tooltipId}`. */
export function Tooltip({
  label,
  align = 'center',
  className,
  children,
}: TooltipProps) {
  const tooltipId = useId()

  return (
    <div
      className={['relative inline-flex', className].filter(Boolean).join(' ')}
    >
      {children(tooltipId)}
      <span
        id={tooltipId}
        role="tooltip"
        className={tooltipPopupClassName(align)}
      >
        {label}
      </span>
    </div>
  )
}
