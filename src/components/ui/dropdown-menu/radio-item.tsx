import { ItemIndicator, RadioItem } from '@radix-ui/react-dropdown-menu'
import { DotFilledIcon } from '@radix-ui/react-icons'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

type Component = typeof RadioItem
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export type DropdownMenuRadioItemProps = RefProps

export const DropdownMenuRadioItem = forwardRef<Ref, DropdownMenuRadioItemProps>(
  function DropdownMenuRadioItem(props, ref) {
    const { className, children, ...restProps } = props

    return (
      <RadioItem
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
        {...restProps}
      >
        <span className={cn('absolute left-2 flex h-3.5 w-3.5 items-center justify-center')}>
          <ItemIndicator>
            <DotFilledIcon className={cn('h-4 w-4 fill-current')} />
          </ItemIndicator>
        </span>
        {children}
      </RadioItem>
    )
  },
)
