import { Close, Content } from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

import { DialogPortal } from './core'
import { DialogOverlay } from './overlay'

export const dialogContentVariants = cva(
  cn(
    'fixed z-50 grid rounded-lg',
    'gap-4 border bg-background p-6 shadow-lg',
    'duration-200 data-[state=open]:animate-in',
    'data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0',
    'data-[state=open]:fade-in-0',
    'data-[state=closed]:zoom-out-95',
    'data-[state=open]:zoom-in-95',
  ),
  {
    variants: {
      location: {
        default: cn(
          'left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]',
          'max-w-lg data-[state=closed]:slide-out-to-left-1/2',
          'w-full data-[state=open]:slide-in-from-left-1/2',
        ),
        top: cn(
          'left-[10px] right-[10px] sm:left-[50%] sm:right-[auto]',
          'sm:translate-x-[-50%] top-[10px] sm:w-full',
          'sm:max-w-lg sm:top-[calc(var(--navbar-height)+20px)]',
          'max-h-[calc(var(--visual-vh)*100-20px)]',
          'sm:max-h-[calc(var(--visual-vh)*100-var(--navbar-height)-30px)]',
          'sm:data-[state=closed]:slide-out-to-left-1/2',
          'sm:data-[state=open]:slide-in-from-left-1/2',
        ),
      },
    },
    defaultVariants: {
      location: 'default',
    },
  },
)

type Component = typeof Content
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>
type Variants = VariantProps<typeof dialogContentVariants>

export interface DialogContentProps extends RefProps, Variants {}

export const DialogContent = forwardRef<Ref, DialogContentProps>(
  function DialogContent(props, ref) {
    const { location, className, children, ...restProps } = props

    return (
      <DialogPortal>
        <DialogOverlay />
        <Content
          ref={ref}
          className={cn(dialogContentVariants({ className, location }))}
          {...restProps}
        >
          {children}
          <Close
            className={cn(
              'absolute right-4 top-4 rounded-sm opacity-70',
              'ring-offset-background transition-opacity',
              'hover:opacity-100 focus:outline-none',
              'focus:ring-2 focus:ring-ring focus:ring-offset-2',
              'disabled:pointer-events-none',
              'data-[state=open]:bg-accent data-[state=open]:text-muted-foreground',
            )}
          >
            <Cross2Icon className={cn('h-4 w-4')} />
            <span className={cn('sr-only')}>Close</span>
          </Close>
        </Content>
      </DialogPortal>
    )
  },
)