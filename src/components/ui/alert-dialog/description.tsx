import { Description } from '@radix-ui/react-alert-dialog'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

type Component = typeof Description
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export type AlertDialogDescriptionProps = RefProps

export const AlertDialogDescription = forwardRef<Ref, AlertDialogDescriptionProps>(
  function AlertDialogDescription(props, ref) {
    const { className, ...restProps } = props

    return (
      <Description
        ref={ref}
        className={cn('text-sm text-muted-foreground', className)}
        {...restProps}
      />
    )
  },
)
