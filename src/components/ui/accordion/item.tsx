import { Item } from '@radix-ui/react-accordion'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

type Component = typeof Item
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export type AccordionItemProps = RefProps

export const AccordionItem = forwardRef<Ref, AccordionItemProps>(
  function AccordionItem(props, ref) {
    const { className, ...restProps } = props

    return <Item ref={ref} className={cn('border-b', className)} {...restProps} />
  },
)
