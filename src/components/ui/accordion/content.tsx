import { Content } from '@radix-ui/react-accordion'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

type Component = typeof Content
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export type AccordionContentProps = RefProps

export const AccordionContent = forwardRef<Ref, AccordionContentProps>(
  function AccordionContent(props, ref) {
    const { className, children, ...restProps } = props

    return (
      <Content
        ref={ref}
        className={cn(
          'overflow-hidden text-sm',
          'data-[state=closed]:animate-accordion-up',
          'data-[state=open]:animate-accordion-down',
        )}
        {...restProps}
      >
        <div className={cn('pb-4 pt-0', className)}>{children}</div>
      </Content>
    )
  },
)
