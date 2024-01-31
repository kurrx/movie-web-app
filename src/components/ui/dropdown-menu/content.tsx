import { Content, Portal } from '@radix-ui/react-dropdown-menu'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

type Component = typeof Content
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export interface DropdownMenuContentProps extends RefProps {
  container?: HTMLElement | null
}

export const DropdownMenuContent = forwardRef<Ref, DropdownMenuContentProps>(
  function DropdownMenuContent(props, ref) {
    const { className, container, sideOffset = 4, ...restProps } = props

    return (
      <Portal container={container}>
        <Content
          ref={ref}
          sideOffset={sideOffset}
          className={cn(
            'z-50 min-w-[8rem] overflow-hidden rounded-md',
            'border bg-popover p-1 text-popover-foreground shadow-md',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2',
            'data-[side=left]:slide-in-from-right-2',
            'data-[side=right]:slide-in-from-left-2',
            'data-[side=top]:slide-in-from-bottom-2',
            className,
          )}
          {...restProps}
        />
      </Portal>
    )
  },
)
