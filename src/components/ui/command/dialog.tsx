import { DialogProps } from '@radix-ui/react-dialog'
import { Command as CommandPrimitive } from 'cmdk'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

import { Dialog, DialogContent } from '../dialog'
import { Command } from './core'

type Component = typeof CommandPrimitive
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export interface CommandDialogProps extends RefProps {
  dialogProps?: DialogProps
}

export const CommandDialog = forwardRef<Ref, CommandDialogProps>(
  function CommandDialog(props, ref) {
    const { dialogProps, className, children, ...restProps } = props

    return (
      <Dialog {...dialogProps}>
        <DialogContent location='top' className={cn('overflow-hidden p-0')}>
          <Command
            ref={ref}
            className={cn(
              'max-h-[calc(var(--visual-vh)*100-20px)]',
              'sm:max-h-[calc(var(--visual-vh)*100-var(--navbar-height)-20px)]',
              '[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium',
              '[&_[cmdk-group-heading]]:text-muted-foreground',
              '[&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0',
              '[&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5',
              '[&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12',
              '[&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3',
              '[&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5',
              '[&_[cmdk-skeleton]]:px-2 [&_[cmdk-skeleton]]:py-3',
              className,
            )}
            {...restProps}
          >
            {children}
          </Command>
        </DialogContent>
      </Dialog>
    )
  },
)
