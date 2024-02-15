import { ComponentProps, forwardRef } from 'react'

import { cn } from '@/api'

type Ref = HTMLElement
type RefProps = ComponentProps<'nav'>

export type PaginationProps = RefProps

export const Pagination = forwardRef<Ref, PaginationProps>(function Pagination(props, ref) {
  const { className, ...restProps } = props

  return (
    <nav
      ref={ref}
      role='navigation'
      aria-label='pagination'
      className={cn('mx-auto flex w-full justify-center', className)}
      {...restProps}
    />
  )
})
