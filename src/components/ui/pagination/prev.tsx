import { ChevronLeftIcon } from '@radix-ui/react-icons'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

import { PaginationLink } from './link'

type Component = typeof PaginationLink
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export type PaginationPrevProps = RefProps

export const PaginationPrev = forwardRef<Ref, PaginationPrevProps>(
  function PaginationPrev(props, ref) {
    const { className, ...restProps } = props

    return (
      <PaginationLink
        ref={ref}
        aria-label='Go to previous page'
        size='default'
        className={cn('gap-1 pl-2.5', className)}
        {...restProps}
      >
        <ChevronLeftIcon className='h-4 w-4' />
        <span>Previous</span>
      </PaginationLink>
    )
  },
)
