import { forwardRef, HTMLAttributes } from 'react'

import { cn } from '@/api'

type Ref = HTMLDivElement
type RefProps = HTMLAttributes<Ref>

export type CardFooterProps = RefProps

export const CardFooter = forwardRef<Ref, CardFooterProps>(function CardFooter(props, ref) {
  const { className, ...restProps } = props

  return <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...restProps} />
})
