import { forwardRef, HTMLAttributes } from 'react'

import { cn } from '@/api'

type Ref = HTMLParagraphElement
type RefProps = HTMLAttributes<Ref>

export type CardDescriptionProps = RefProps

export const CardDescription = forwardRef<Ref, CardDescriptionProps>(
  function CardDescription(props, ref) {
    const { className, ...restProps } = props

    return <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...restProps} />
  },
)
