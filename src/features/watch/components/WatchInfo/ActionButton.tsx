import {
  ComponentPropsWithoutRef,
  ElementRef,
  FC,
  forwardRef,
  PropsWithChildren,
  SVGProps,
} from 'react'

import { cn } from '@/api'
import { Button } from '@/components'

type Component = typeof Button
type Ref = ElementRef<Component>
type RefProps = ComponentPropsWithoutRef<Component>

export interface ActionButtonProps extends RefProps, PropsWithChildren {
  Icon: FC<SVGProps<SVGSVGElement>>
  active?: boolean
  disabled?: boolean
  notFill?: boolean
  iconClassName?: string
  onClick?: () => void
}

export const ActionButton = forwardRef<Ref, ActionButtonProps>(function ActionButton(props, ref) {
  const {
    children,
    Icon,
    active = false,
    disabled,
    notFill = false,
    iconClassName,
    onClick,
  } = props

  return (
    <Button
      ref={ref}
      disabled={disabled}
      className='rounded-full'
      variant='secondary'
      onClick={onClick}
    >
      <Icon
        className={cn(
          'mr-2 h-5 w-5 fill-[transparent] transition-colors',
          'data-[active=true]:text-[var(--ui-primary)]',
          !notFill && 'data-[active=true]:fill-[var(--ui-primary)]',
          iconClassName,
        )}
        data-active={active}
      />
      {children}
    </Button>
  )
})
