import { Label } from '@radix-ui/react-dropdown-menu'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

type Component = typeof Label
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export interface DropdownMenuLabelProps extends RefProps {
  inset?: boolean
}

export const DropdownMenuLabel = forwardRef<Ref, DropdownMenuLabelProps>(
  function DropdownMenuLabel(props, ref) {
    const { className, inset, ...restProps } = props

    return (
      <Label
        ref={ref}
        className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
        {...restProps}
      />
    )
  },
)
