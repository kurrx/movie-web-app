import { forwardRef, HTMLAttributes } from 'react'

import { cn } from '@/api'

type Ref = HTMLHeadingElement
type RefProps = HTMLAttributes<Ref>

export type AlertTitleProps = RefProps

export const AlertTitle = forwardRef<Ref, AlertTitleProps>(function AlertTitle(props, ref) {
  const { className, children, ...restProps } = props

  return (
    <h5 ref={ref} className={cn('font-bold leading-none tracking-tight', className)} {...restProps}>
      {children}
    </h5>
  )
})
