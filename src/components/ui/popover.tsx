import { Anchor, Content, Root, Trigger } from '@radix-ui/react-popover'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

export const Popover = Root
export const PopoverTrigger = Trigger
export const PopoverAnchor = Anchor

type Component = typeof Content
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export type PopoverContentProps = RefProps

export const PopoverContent = forwardRef<Ref, PopoverContentProps>(
  function PopoverContent(props, ref) {
    const { className, align = 'center', sideOffset = 4, ...restProps } = props

    return (
      <Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-50 w-72 rounded-md border bg-popover',
          'p-4 text-popover-foreground shadow-md',
          'outline-none data-[state=open]:animate-in',
          'data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0',
          'data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95',
          'data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2',
          'data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2',
          'data-[side=top]:slide-in-from-bottom-2',
          className,
        )}
        {...restProps}
      />
    )
  },
)
