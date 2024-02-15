import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { forwardRef, HTMLAttributes } from 'react'

import { cn } from '@/api'

type Ref = HTMLSpanElement
type RefProps = HTMLAttributes<Ref>

export type PaginationEllipsisProps = RefProps

export const PaginationEllipsis = forwardRef<Ref, PaginationEllipsisProps>(
  function PaginationEllipsis(props, ref) {
    const { className, ...restProps } = props

    return (
      <span
        ref={ref}
        aria-hidden
        className={cn('flex h-9 w-9 items-center justify-center', className)}
        {...restProps}
      >
        <DotsHorizontalIcon className='h-4 w-4' />
        <span className='sr-only'>More pages</span>
      </span>
    )
  },
)
