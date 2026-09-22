import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

type ContainerWidth = 'page' | 'article'
type ContainerElement = 'div' | 'main' | 'article' | 'section'

const widthClass: Record<ContainerWidth, string> = {
  page: 'max-w-container px-page',
  article: 'max-w-content px-inline',
}

type ContainerProps<T extends ContainerElement> = {
  as?: T
  width?: ContainerWidth
  className?: string
  children?: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'width' | 'className' | 'children'>

export function Container<T extends ContainerElement = 'div'>({
  as,
  width = 'page',
  className,
  children,
  ...rest
}: ContainerProps<T>) {
  const Component = (as ?? 'div') as ElementType
  const classes = ['mx-auto', 'w-full', widthClass[width], className]
    .filter(Boolean)
    .join(' ')

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  )
}
