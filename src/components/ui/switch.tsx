import { Root, Thumb } from '@radix-ui/react-switch'
import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'

import { cn } from '@/api'

type Component = typeof Root
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export type SwitchProps = RefProps

export const Switch = forwardRef<Ref, SwitchProps>(function Switch(props, ref) {
  const { className, children, ...restProps } = props

  return (
    <Root
      ref={ref}
      className={cn(
        'peer inline-flex shrink-0 cursor-pointer',
        'items-center rounded-full border-2 border-transparent',
        'shadow-sm transition-colors',
        'disabled:cursor-not-allowed',
        'disabled:opacity-50 h-5 w-9',
        'data-[state=checked]:bg-white',
        'data-[state=unchecked]:bg-white/30',
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-ring',
        className,
      )}
      {...restProps}
    >
      <Thumb
        className={cn(
          'pointer-events-none flex rounded-full',
          'bg-black shadow-lg ring-0 justify-center',
          'transition-transform items-center h-4 w-4',
          'data-[state=checked]:translate-x-4',
          'data-[state=unchecked]:translate-x-0',
        )}
      >
        {children}
      </Thumb>
    </Root>
  )
})
