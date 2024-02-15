import { ChevronRightIcon } from '@radix-ui/react-icons'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

import { PaginationLink } from './link'

type Component = typeof PaginationLink
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export type PaginationNextProps = RefProps

export const PaginationNext = forwardRef<Ref, PaginationNextProps>(
  function PaginationNext(props, ref) {
    const { className, ...restProps } = props

    return (
      <PaginationLink
        ref={ref}
        aria-label='Go to next page'
        size='default'
        className={cn('gap-1 pr-2.5', className)}
        {...restProps}
      >
        <span>Next</span>
        <ChevronRightIcon className='h-4 w-4' />
      </PaginationLink>
    )
  },
)
