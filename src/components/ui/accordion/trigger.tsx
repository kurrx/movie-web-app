import { Header, Trigger } from '@radix-ui/react-accordion'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/api'

type Component = typeof Trigger
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export type AccordionTriggerProps = RefProps

export const AccordionTrigger = forwardRef<Ref, AccordionTriggerProps>(
  function AccordionTrigger(props, ref) {
    const { className, children, ...restProps } = props

    return (
      <Header className='flex'>
        <Trigger
          ref={ref}
          className={cn(
            'flex flex-1 items-center justify-between py-4',
            'text-sm font-medium transition-all hover:underline',
            '[&[data-state=open]>svg]:rotate-180',
            className,
          )}
          {...restProps}
        >
          {children}
          <ChevronDownIcon
            className={cn(
              'h-4 w-4 shrink-0 text-muted-foreground',
              'transition-transform duration-200',
            )}
          />
        </Trigger>
      </Header>
    )
  },
)
