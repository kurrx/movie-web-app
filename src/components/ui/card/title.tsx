/* eslint-disable jsx-a11y/heading-has-content */
import { forwardRef, HTMLAttributes } from 'react'

import { cn } from '@/api'

type Ref = HTMLHeadingElement
type RefProps = HTMLAttributes<Ref>

export type CardTitleProps = RefProps

export const CardTitle = forwardRef<Ref, CardTitleProps>(function CardTitle(props, ref) {
  const { className, ...restProps } = props

  return (
    <h3
      ref={ref}
      className={cn('font-semibold leading-none tracking-tight', className)}
      {...restProps}
    />
  )
})
