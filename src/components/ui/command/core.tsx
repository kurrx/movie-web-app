import { Command as CommandPrimitive } from 'cmdk'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

type Component = typeof CommandPrimitive
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export type CommandProps = RefProps

export const Command = forwardRef<Ref, CommandProps>(function Command(props, ref) {
  const { className, ...restProps } = props

  return (
    <CommandPrimitive
      ref={ref}
      className={cn(
        'flex h-full w-full flex-col overflow-hidden',
        'rounded-md bg-popover text-popover-foreground',
        className,
      )}
      {...restProps}
    />
  )
})
