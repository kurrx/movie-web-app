import { cva, VariantProps } from 'class-variance-authority'
import { forwardRef, HTMLAttributes } from 'react'

import { cn } from '@/api'

export const alertVariants = cva(
  cn(
    'relative w-full rounded-lg border px-4 py-3 text-sm flex items-start [&>svg]:shrink-0 [&>svg]:mt-0.5 [&>button]:self-center',
  ),
  {
    variants: {
      variant: {
        default: cn('bg-background text-foreground'),
        destructive: cn(
          'border-destructive/50 text-destructive',
          'dark:border-destructive [&>svg]:text-destructive',
        ),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type Ref = HTMLDivElement
type RefProps = HTMLAttributes<Ref>
type Variants = VariantProps<typeof alertVariants>

export interface AlertProps extends RefProps, Variants {}

export const Alert = forwardRef<Ref, AlertProps>(function Alert(props, ref) {
  const { className, variant, ...restProps } = props

  return (
    <div
      ref={ref}
      role='alert'
      className={cn(alertVariants({ variant }), className)}
      {...restProps}
    />
  )
})
