import { Separator } from '@radix-ui/react-dropdown-menu'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

type Component = typeof Separator
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export type DropdownMenuSeparatorProps = RefProps

export const DropdownMenuSeparator = forwardRef<Ref, DropdownMenuSeparatorProps>(
  function DropdownMenuSeparator(props, ref) {
    const { className, ...restProps } = props

    return (
      <Separator ref={ref} className={cn('-mx-1 my-1 h-px bg-muted', className)} {...restProps} />
    )
  },
)
