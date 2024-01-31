import { forwardRef, HTMLAttributes } from 'react'

import { cn } from '@/api'

type Ref = HTMLDivElement
type RefProps = HTMLAttributes<Ref>

export type AlertDialogHeaderProps = RefProps

export const AlertDialogHeader = forwardRef<Ref, AlertDialogHeaderProps>(
  function AlertDialogHeader(props, ref) {
    const { className, ...restProps } = props

    return (
      <div
        ref={ref}
        className={cn('flex flex-col space-y-2 text-center sm:text-left', className)}
        {...restProps}
      />
    )
  },
)
