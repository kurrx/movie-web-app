import { Range, Root, Thumb, Track } from '@radix-ui/react-slider'
import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'

import { cn } from '@/api'

type Component = typeof Root
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export interface SliderProps extends RefProps {
  onThumbFocus?: () => void
  onThumbBlur?: () => void
}

export const Slider = forwardRef<Ref, SliderProps>(function Slider(props, ref) {
  const { className, onThumbFocus, onThumbBlur, ...restProps } = props

  return (
    <Root
      ref={ref}
      className={cn('relative flex w-full touch-none select-none items-center', className)}
      {...restProps}
    >
      <Track className={cn('relative h-full self-stretch w-full grow overflow-hidden')}>
        <Range className='absolute rounded-sm h-1 top-[calc(50%-2px)] left-0 bg-primary' />
        <span className='absolute w-full rounded-sm h-1 top-[calc(50%-2px)] left-0 bg-primary/20' />
      </Track>
      <Thumb
        className={cn(
          'block h-3 w-3 rounded-full',
          'bg-primary transition-colors',
          'focus-visible:outline-none',
          'focus-visible:ring-1',
          'focus-visible:ring-ring',
          'disabled:pointer-events-none',
          'disabled:opacity-50',
        )}
        onFocus={onThumbFocus}
        onBlur={onThumbBlur}
      />
    </Root>
  )
})
