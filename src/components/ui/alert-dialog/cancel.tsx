import { Cancel } from '@radix-ui/react-alert-dialog'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

import { buttonVariants } from '../button'

type Component = typeof Cancel
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export type AlertDialogCancelProps = RefProps

export const AlertDialogCancel = forwardRef<Ref, AlertDialogCancelProps>(
  function AlertDialogCancel(props, ref) {
    const { className, ...restProps } = props

    return (
      <Cancel
        ref={ref}
        className={cn(buttonVariants({ variant: 'outline' }), 'mt-2 sm:mt-0', className)}
        {...restProps}
      />
    )
  },
)
