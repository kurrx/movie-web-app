import { Command as CommandPrimitive } from 'cmdk'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

type Component = typeof CommandPrimitive.Empty
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export type CommandEmptyProps = RefProps

export const CommandEmpty = forwardRef<Ref, CommandEmptyProps>(function CommandEmpty(props, ref) {
  const { className, ...restProps } = props

  return (
    <CommandPrimitive.Empty
      ref={ref}
      className={cn('py-6 text-center text-sm', className)}
      {...restProps}
    />
  )
})
