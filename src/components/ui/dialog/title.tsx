import { Title } from '@radix-ui/react-dialog'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

type Component = typeof Title
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export type DialogTitleProps = RefProps

export const DialogTitle = forwardRef<Ref, DialogTitleProps>(function DialogTitle(props, ref) {
  const { className, ...restProps } = props

  return (
    <Title
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...restProps}
    />
  )
})
