import { forwardRef, HTMLAttributes } from 'react'

import { cn } from '@/api'

type Ref = HTMLDivElement
type RefProps = HTMLAttributes<Ref>

export type CardHeaderProps = RefProps

export const CardHeader = forwardRef<Ref, CardHeaderProps>(function CardHeader(props, ref) {
  const { className, ...restProps } = props

  return <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...restProps} />
})
