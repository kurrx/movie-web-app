import { ChevronLeftIcon, DoubleArrowLeftIcon } from '@radix-ui/react-icons'
import { ComponentPropsWithoutRef, ElementRef, forwardRef, useMemo } from 'react'

import { cn } from '@/api'

import { PaginationLink } from './link'

type Component = typeof PaginationLink
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export interface PaginationPrevProps extends RefProps {
  first?: boolean
}

export const PaginationPrev = forwardRef<Ref, PaginationPrevProps>(
  function PaginationPrev(props, ref) {
    const { className, first, ...restProps } = props
    const Icon = useMemo(() => (first ? DoubleArrowLeftIcon : ChevronLeftIcon), [first])

    return (
      <PaginationLink
        ref={ref}
        aria-label='Go to previous page'
        size='icon'
        className={cn('', className)}
        {...restProps}
      >
        <Icon className='h-4 w-4' />
      </PaginationLink>
    )
  },
)
