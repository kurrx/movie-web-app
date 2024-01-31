import { forwardRef, HTMLAttributes } from 'react'

import { cn } from '@/api'

type Ref = HTMLDivElement
type RefProps = HTMLAttributes<Ref>

export type AlertDescriptionProps = RefProps

export const AlertDescription = forwardRef<Ref, AlertDescriptionProps>(
  function AlertDescription(props, ref) {
    const { className, ...restProps } = props

    return <div ref={ref} className={cn('text-sm', className)} {...restProps} />
  },
)
