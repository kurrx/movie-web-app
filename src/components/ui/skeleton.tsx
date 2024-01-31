import { forwardRef, HTMLAttributes } from 'react'

import { cn } from '@/api'

type Ref = HTMLDivElement
type RefProps = HTMLAttributes<Ref>

export type SkeletonProps = RefProps

export const Skeleton = forwardRef<Ref, SkeletonProps>(function Skeleton(props, ref) {
  const { className, ...restProps } = props

  return (
    <div
      ref={ref}
      className={cn('animate-pulse rounded-md bg-primary/10', className)}
      {...restProps}
    />
  )
})
