import { Title } from '@radix-ui/react-dialog'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

type Component = typeof Title
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export type SheetTitleProps = RefProps

export const SheetTitle = forwardRef<Ref, SheetTitleProps>(function SheetTitle(props, ref) {
  const { className, ...restProps } = props

  return (
    <Title
      ref={ref}
      className={cn('text-lg font-semibold text-foreground', className)}
      {...restProps}
    />
  )
})
