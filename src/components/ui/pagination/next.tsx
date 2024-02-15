import { ChevronRightIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons'
import { ComponentPropsWithoutRef, ElementRef, forwardRef, useMemo } from 'react'

import { cn } from '@/api'

import { PaginationLink } from './link'

type Component = typeof PaginationLink
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export interface PaginationNextProps extends RefProps {
  last?: boolean
}

export const PaginationNext = forwardRef<Ref, PaginationNextProps>(
  function PaginationNext(props, ref) {
    const { className, last, ...restProps } = props
    const Icon = useMemo(() => (last ? DoubleArrowRightIcon : ChevronRightIcon), [last])

    return (
      <PaginationLink
        ref={ref}
        aria-label='Go to next page'
        size='icon'
        className={cn('', className)}
        {...restProps}
      >
        <Icon className='h-4 w-4' />
      </PaginationLink>
    )
  },
)
