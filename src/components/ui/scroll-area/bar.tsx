import { ScrollAreaScrollbar, ScrollAreaThumb } from '@radix-ui/react-scroll-area'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

type Component = typeof ScrollAreaScrollbar
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export type ScrollAreaBarProps = RefProps

export const ScrollAreaBar = forwardRef<Ref, ScrollAreaBarProps>(
  function ScrollAreaBar(props, ref) {
    const { className, orientation = 'vertical', ...restProps } = props

    return (
      <ScrollAreaScrollbar
        ref={ref}
        orientation={orientation}
        className={cn(
          'flex touch-none select-none transition-colors',
          orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-[1px]',
          orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent p-[1px]',
          className,
        )}
        {...restProps}
      >
        <ScrollAreaThumb className='relative flex-1 rounded-full bg-border' />
      </ScrollAreaScrollbar>
    )
  },
)
