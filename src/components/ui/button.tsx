import { Slot } from '@radix-ui/react-slot'
import { cva, VariantProps } from 'class-variance-authority'
import { ButtonHTMLAttributes, forwardRef } from 'react'

import { cn } from '@/api'

export const buttonVariants = cva(
  cn(
    'inline-flex items-center justify-center whitespace-nowrap',
    'rounded-md text-sm font-medium transition-colors',
    'disabled:pointer-events-none outline-none',
    'focus-visible:outline-none focus-visible:ring-2',
    'disabled:opacity-50 focus-visible:ring-ring',
  ),
  {
    variants: {
      variant: {
        default: cn('bg-primary text-primary-foreground shadow hover:bg-primary/90'),
        destructive: cn(
          'bg-destructive text-destructive-foreground',
          'shadow-sm hover:bg-destructive/90',
        ),
        outline: cn(
          'border border-input bg-background shadow-sm',
          'hover:bg-accent hover:text-accent-foreground',
        ),
        secondary: cn('bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80'),
        ghost: cn('hover:bg-accent hover:text-accent-foreground'),
        link: cn('text-primary underline-offset-4 hover:underline'),
        custom: cn(''),
      },
      size: {
        default: cn('h-9 px-4 py-2'),
        sm: cn('h-8 rounded-md px-3 text-xs'),
        lg: cn('h-10 rounded-md px-8'),
        icon: cn('h-9 w-9'),
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type Ref = HTMLButtonElement
type RefProps = ButtonHTMLAttributes<Ref>
type Variants = VariantProps<typeof buttonVariants>

export interface ButtonProps extends RefProps, Variants {
  asChild?: boolean
}

export const Button = forwardRef<Ref, ButtonProps>(function Button(props, ref) {
  const { className, variant, size, asChild = false, ...restProps } = props
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...restProps} />
  )
})
