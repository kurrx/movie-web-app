import { forwardRef, HTMLAttributes } from 'react'

import { cn } from '@/api'

type Ref = HTMLUListElement
type RefProps = HTMLAttributes<Ref>

export type PaginationContentProps = RefProps

export const PaginationContent = forwardRef<Ref, PaginationContentProps>(
  function PaginationContent(props, ref) {
    const { className, ...restProps } = props

    return (
      <ul ref={ref} className={cn('flex flex-row items-center gap-1', className)} {...restProps} />
    )
  },
)
