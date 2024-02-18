import { Item } from '@radix-ui/react-dropdown-menu'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

type Component = typeof Item
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export interface DropdownMenuItemProps extends RefProps {
  inset?: boolean
}

export const DropdownMenuItem = forwardRef<Ref, DropdownMenuItemProps>(
  function DropdownMenuItem(props, ref) {
    const { className, inset, ...restProps } = props

    return (
      <Item
        ref={ref}
        className={cn(
          'relative flex cursor-default select-none',
          'items-center rounded-sm px-2 py-1.5 text-sm',
          'outline-none transition-colors focus:bg-accent',
          'focus:text-accent-foreground focus:cursor-pointer',
          'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          'data-[active=true]:bg-primary data-[active=true]:text-primary-foreground',
          inset && 'pl-8',
          className,
        )}
        {...restProps}
      />
    )
  },
)
