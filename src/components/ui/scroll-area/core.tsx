import { Corner, Root, Viewport } from '@radix-ui/react-scroll-area'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

import { ScrollAreaBar } from './bar'

type Component = typeof Root
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export interface ScrollAreaProps extends RefProps {
  hideBar?: boolean
}

export const ScrollArea = forwardRef<Ref, ScrollAreaProps>(function ScrollArea(props, ref) {
  const { className, hideBar, children, ...restProps } = props

  return (
    <Root ref={ref} className={cn('relative overflow-hidden', className)} {...restProps}>
      <Viewport className='h-full w-full rounded-[inherit]'>{children}</Viewport>
      <ScrollAreaBar className={cn(hideBar && 'opacity-0 pointer-events-none')} />
      <Corner />
    </Root>
  )
})
