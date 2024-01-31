import { cva, VariantProps } from 'class-variance-authority'
import { forwardRef, HTMLAttributes } from 'react'

import { cn } from '@/api'

export const badgeVariants = cva(
  cn(
    'inline-flex items-center rounded-md border',
    'px-2.5 py-0.5 text-xs font-semibold',
    'transition-colors focus:outline-none',
    'focus:ring-2 focus:ring-ring focus:ring-offset-2',
  ),
  {
    variants: {
      variant: {
        default: cn(
          'border-transparent bg-primary text-primary-foreground',
          'shadow hover:bg-primary/80',
        ),
        secondary: cn(
          'border-transparent bg-secondary text-secondary-foreground',
          'hover:bg-secondary/80',
        ),
        destructive: cn(
          'border-transparent bg-destructive text-destructive-foreground',
          'shadow hover:bg-destructive/80',
        ),
        outline: cn('text-foreground'),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type Ref = HTMLDivElement
type RefProps = HTMLAttributes<Ref>
type Variants = VariantProps<typeof badgeVariants>

export interface BadgeProps extends RefProps, Variants {}

export const Badge = forwardRef<Ref, BadgeProps>(function Badge(props, ref) {
  const { className, variant, ...restProps } = props

  return <div ref={ref} className={cn(badgeVariants({ variant }), className)} {...restProps} />
})
