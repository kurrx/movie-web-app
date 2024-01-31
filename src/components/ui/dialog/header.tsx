import { forwardRef, HTMLAttributes } from 'react'

import { cn } from '@/api'

type Ref = HTMLDivElement
type RefProps = HTMLAttributes<Ref>

export type DialogHeaderProps = RefProps

export const DialogHeader = forwardRef<Ref, DialogHeaderProps>(function DialogHeader(props, ref) {
  const { className, ...restProps } = props

  return (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}
      {...restProps}
    />
  )
})
