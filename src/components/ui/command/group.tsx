import { Command as CommandPrimitive } from 'cmdk'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

type Component = typeof CommandPrimitive.Group
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export type CommandGroupProps = RefProps

export const CommandGroup = forwardRef<Ref, CommandGroupProps>(function CommandGroup(props, ref) {
  const { className, ...restProps } = props

  return (
    <CommandPrimitive.Group
      ref={ref}
      className={cn(
        'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2',
        '[&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs',
        '[&_[cmdk-group-heading]]:font-medium',
        '[&_[cmdk-group-heading]]:text-muted-foreground',
        className,
      )}
      {...restProps}
    />
  )
})
