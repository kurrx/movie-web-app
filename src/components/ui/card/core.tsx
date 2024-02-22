import { forwardRef, HTMLAttributes } from 'react'

import { cn } from '@/api'

type Ref = HTMLDivElement
type RefProps = HTMLAttributes<Ref>

export type CardProps = RefProps

export const Card = forwardRef<Ref, CardProps>(function Card(props, ref) {
  const { className, ...restProps } = props

  return (
    <div
      ref={ref}
      className={cn('rounded-xl border bg-card text-card-foreground', className)}
      {...restProps}
    />
  )
})
