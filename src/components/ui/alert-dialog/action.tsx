import { Action } from '@radix-ui/react-alert-dialog'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

import { buttonVariants } from '../button'

type Component = typeof Action
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export type AlertDialogActionProps = RefProps

export const AlertDialogAction = forwardRef<Ref, AlertDialogActionProps>(
  function AlertDialogAction(props, ref) {
    const { className, ...restProps } = props

    return <Action ref={ref} className={cn(buttonVariants(), className)} {...restProps} />
  },
)
