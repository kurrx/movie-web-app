import { forwardRef, HTMLAttributes } from 'react'

import { cn } from '@/api'

type Ref = HTMLDivElement
type RefProps = HTMLAttributes<Ref>

export type AlertContentProps = RefProps

export const AlertContent = forwardRef<Ref, AlertContentProps>(function AlertContent(props, ref) {
  const { className, ...restProps } = props

  return <div ref={ref} className={cn('mx-3 grow [&>*+*]:mt-1', className)} {...restProps} />
})
