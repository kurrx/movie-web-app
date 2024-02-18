import { SubTrigger } from '@radix-ui/react-dropdown-menu'
import { ChevronRightIcon } from '@radix-ui/react-icons'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

type Component = typeof SubTrigger
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export interface DropdownMenuSubTriggerProps extends RefProps {
  inset?: boolean
}

export const DropdownMenuSubTrigger = forwardRef<Ref, DropdownMenuSubTriggerProps>(
  function DropdownMenuSubTrigger(props, ref) {
    const { className, inset, children, ...restProps } = props

    return (
      <SubTrigger
        ref={ref}
        className={cn(
          'flex cursor-default select-none items-center focus:cursor-pointer',
          'rounded-sm px-2 py-1.5 text-sm outline-none',
          'focus:bg-accent data-[state=open]:bg-accent',
          inset && 'pl-8',
          className,
        )}
        {...restProps}
      >
        {children}
        <ChevronRightIcon className={cn('ml-auto h-4 w-4')} />
      </SubTrigger>
    )
  },
)
