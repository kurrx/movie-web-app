import { Overlay } from '@radix-ui/react-dialog'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

type Component = typeof Overlay
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export type SheetOverlayProps = RefProps

export const SheetOverlay = forwardRef<Ref, SheetOverlayProps>(function SheetOverlay(props, ref) {
  const { className, ...restProps } = props

  return (
    <Overlay
      className={cn(
        'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        'data-[state=open]:fade-in-0',
        className,
      )}
      {...restProps}
      ref={ref}
    />
  )
})
