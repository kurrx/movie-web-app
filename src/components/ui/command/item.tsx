import { Command as CommandPrimitive } from 'cmdk'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

type Component = typeof CommandPrimitive.Item
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export type CommandItemProps = RefProps

export const CommandItem = forwardRef<Ref, CommandItemProps>(function CommandItem(props, ref) {
  const { className, ...restProps } = props

  return (
    <CommandPrimitive.Item
      ref={ref}
      className={cn(
        'relative flex cursor-default select-none',
        'items-center rounded-sm px-2 py-1.5 text-sm',
        'outline-none aria-selected:bg-accent',
        'aria-selected:text-accent-foreground',
        'data-[disabled]:pointer-events-none',
        'data-[disabled]:opacity-50 aria-selected:cursor-pointer',
        className,
      )}
      {...restProps}
    />
  )
})
