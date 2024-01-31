import { Root } from '@radix-ui/react-separator'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

type Component = typeof Root
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export type SeparatorProps = RefProps

export const Separator = forwardRef<Ref, SeparatorProps>(function Separator(props, ref) {
  const { orientation = 'horizontal', decorative = true, className, ...restProps } = props

  return (
    <Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className,
      )}
      {...restProps}
    />
  )
})
