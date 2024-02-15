import { forwardRef, HTMLAttributes } from 'react'

import { cn } from '@/api'

type Ref = HTMLLIElement
type RefProps = HTMLAttributes<Ref>

export type PaginationItemProps = RefProps

export const PaginationItem = forwardRef<Ref, PaginationItemProps>(
  function PaginationItem(props, ref) {
    const { className, ...restProps } = props

    return <li ref={ref} className={cn('', className)} {...restProps} />
  },
)
