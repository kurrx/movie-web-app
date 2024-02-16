import { forwardRef, HTMLAttributes } from 'react'

import { cn } from '@/api'

type Ref = HTMLDivElement
type RefProps = HTMLAttributes<Ref>

export type CardContentProps = RefProps

export const CardContent = forwardRef<Ref, CardContentProps>(function CardContent(props, ref) {
  const { className, ...restProps } = props

  return <div ref={ref} className={cn('p-6 pt-0', className)} {...restProps} />
})
