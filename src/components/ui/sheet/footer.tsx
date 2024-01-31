import { forwardRef, HTMLAttributes } from 'react'

import { cn } from '@/api'

type Ref = HTMLDivElement
type RefProps = HTMLAttributes<Ref>

export type SheetFooterProps = RefProps

export const SheetFooter = forwardRef<Ref, SheetFooterProps>(function SheetFooter(props, ref) {
  const { className, ...restProps } = props

  return (
    <div
      ref={ref}
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
      {...restProps}
    />
  )
})
