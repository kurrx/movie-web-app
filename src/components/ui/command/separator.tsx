import { Command as CommandPrimitive } from 'cmdk'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

type Component = typeof CommandPrimitive.Separator
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export type CommandSeparatorProps = RefProps

export const CommandSeparator = forwardRef<Ref, CommandSeparatorProps>(
  function CommandSeparator(props, ref) {
    const { className, ...restProps } = props

    return (
      <CommandPrimitive.Separator
        ref={ref}
        className={cn('-mx-1 h-px bg-border', className)}
        {...restProps}
      />
    )
  },
)
