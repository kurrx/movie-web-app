import { Command as CommandPrimitive } from 'cmdk'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

type Component = typeof CommandPrimitive.List
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export type CommandListProps = RefProps

export const CommandList = forwardRef<Ref, CommandListProps>(function CommandList(props, ref) {
  const { className, ...restProps } = props

  return (
    <CommandPrimitive.List
      ref={ref}
      className={cn('max-h-full sm:max-h-[400px] overflow-y-auto overflow-x-hidden', className)}
      {...restProps}
    />
  )
})
