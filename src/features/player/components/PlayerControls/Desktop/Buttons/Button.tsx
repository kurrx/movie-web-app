import { Children, forwardRef, Fragment, PropsWithChildren, useMemo } from 'react'

import { cn } from '@/api'
import { IconSwap } from '@/components'

import { PlayerTooltip } from '../../PlayerTooltip'

export interface ButtonProps extends PropsWithChildren {
  id: string
  tooltip: string
  tooltipHotkey?: string
  tooltipDisabled?: boolean
  disabled?: boolean
  className?: string
  visible?: boolean
  onClick?: () => void
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const {
    id,
    tooltip,
    tooltipHotkey,
    tooltipDisabled,
    disabled,
    className,
    visible = true,
    onClick,
    children,
  } = props
  const [Icon, ...Others] = useMemo(() => Children.toArray(children), [children])

  return (
    <PlayerTooltip
      content={
        <p>
          {tooltip}
          {tooltipHotkey && (
            <Fragment>
              &#32;(<span className='font-mono font-medium'>{tooltipHotkey}</span>)
            </Fragment>
          )}
        </p>
      }
      className='max-w-[15.625rem]'
      disabled={tooltipDisabled}
    >
      <button
        ref={ref}
        className={cn(
          'text-[3rem] shrink-0 flex items-center justify-center',
          'w-[1em] h-[1em] border-none outline-none cursor-pointer',
          'bg-none text-white [&_svg]:w-[1em] [&_svg]:h-[1em]',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-ring rounded-md',
          'data-[visible=false]:hidden',
          className,
        )}
        disabled={disabled}
        data-visible={visible}
        onClick={onClick}
      >
        <IconSwap id={id}>{Icon}</IconSwap>
        {Others}
      </button>
    </PlayerTooltip>
  )
})
