import { Root } from '@radix-ui/react-label'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

const labelVariants = cva(
  cn(
    'text-sm font-medium leading-none',
    'peer-disabled:cursor-not-allowed',
    'peer-disabled:opacity-70',
  ),
)

type Component = typeof Root
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export interface LabelProps extends RefProps, VariantProps<typeof labelVariants> {}

export const Label = forwardRef<Ref, LabelProps>(function Label(props, ref) {
  const { className, ...restProps } = props

  return <Root ref={ref} className={cn(labelVariants(), className)} {...restProps} />
})
