import { Content, Portal, Provider, Root, Trigger } from '@radix-ui/react-tooltip'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

export const TooltipProvider = Provider
export const Tooltip = Root
export const TooltipTrigger = Trigger

type Component = typeof Content
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export interface TooltipContentProps extends RefProps {
  container?: HTMLElement | null
}

export const TooltipContent = forwardRef<Ref, TooltipContentProps>(
  function TooltipContent(props, ref) {
    const { className, container, sideOffset = 4, ...restProps } = props

    return (
      <Portal container={container}>
        <Content
          ref={ref}
          sideOffset={sideOffset}
          className={cn(
            'z-50 overflow-hidden rounded-md bg-primary',
            'px-3 py-1.5 text-xs text-primary-foreground',
            'animate-in fade-in-0 zoom-in-95',
            'data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0',
            'data-[state=closed]:zoom-out-95',
            'data-[side=bottom]:slide-in-from-top-2',
            'data-[side=left]:slide-in-from-right-2',
            'data-[side=right]:slide-in-from-left-2',
            'data-[side=top]:slide-in-from-bottom-2',
            'select-none',
            className,
          )}
          {...restProps}
        />
      </Portal>
    )
  },
)
