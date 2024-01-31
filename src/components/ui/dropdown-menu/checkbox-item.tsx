import { CheckboxItem, ItemIndicator } from '@radix-ui/react-dropdown-menu'
import { CheckIcon } from '@radix-ui/react-icons'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

type Component = typeof CheckboxItem
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export type DropdownMenuCheckboxItemProps = RefProps

export const DropdownMenuCheckboxItem = forwardRef<Ref, DropdownMenuCheckboxItemProps>(
  function DropdownMenuCheckboxItem(props, ref) {
    const { className, children, checked, ...restProps } = props

    return (
      <CheckboxItem
        ref={ref}
        className={cn(
          'relative flex cursor-default select-none',
          'items-center rounded-sm py-1.5 pl-8 pr-2',
          'text-sm outline-none transition-colors',
          'focus:bg-accent focus:text-accent-foreground',
          'data-[disabled]:pointer-events-none',
          'data-[disabled]:opacity-50',
          className,
        )}
        checked={checked}
        {...restProps}
      >
        <span className={cn('absolute left-2 flex h-3.5 w-3.5 items-center justify-center')}>
          <ItemIndicator>
            <CheckIcon className={cn('h-4 w-4')} />
          </ItemIndicator>
        </span>
        {children}
      </CheckboxItem>
    )
  },
)
