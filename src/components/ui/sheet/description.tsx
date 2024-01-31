import { Description } from '@radix-ui/react-dialog'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

type Component = typeof Description
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export type SheetDescriptionProps = RefProps

export const SheetDescription = forwardRef<Ref, SheetDescriptionProps>(
  function SheetDescription(props, ref) {
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
