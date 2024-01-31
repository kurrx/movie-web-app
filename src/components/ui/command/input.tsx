import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Command as CommandPrimitive } from 'cmdk'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

type Component = typeof CommandPrimitive.Input
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export interface CommandInputProps extends RefProps {
  border?: boolean
}

export const CommandInput = forwardRef<Ref, CommandInputProps>(function CommandInput(props, ref) {
  const { className, border = false, ...restProps } = props

  return (
    <div
      // eslint-disable-next-line react/no-unknown-property
      cmdk-input-wrapper=''
      className={cn(`flex items-center ${border ? 'border-b' : 'border-b-0'} px-3`)}
    >
      <MagnifyingGlassIcon className={cn('mr-2 h-4 w-4 shrink-0 opacity-50')} />
      <CommandPrimitive.Input
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-md bg-transparent',
          'py-3 text-sm outline-none placeholder:text-muted-foreground',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...restProps}
      />
    </div>
  )
})
