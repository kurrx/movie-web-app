import { Title } from '@radix-ui/react-alert-dialog'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

type Component = typeof Title
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export type AlertDialogTitleProps = RefProps

export const AlertDialogTitle = forwardRef<Ref, AlertDialogTitleProps>(
  function AlertDialogTitle(props, ref) {
    const { className, ...restProps } = props

    return <Title ref={ref} className={cn('text-lg font-semibold', className)} {...restProps} />
  },
)
