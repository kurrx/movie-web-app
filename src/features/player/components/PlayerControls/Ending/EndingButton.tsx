import { PropsWithChildren } from 'react'

import { cn } from '@/api'
import { IconSwap } from '@/components'

import { PlayerTooltip } from '../PlayerTooltip'

export interface EndingReplayProps extends PropsWithChildren {
  id: string
  big?: boolean
  disabled?: boolean
  tooltipTitle?: string
  hidden?: boolean
  onClick: () => void
}

export function EndingButton(props: EndingReplayProps) {
  const { id, big, disabled, tooltipTitle, hidden, onClick, children } = props

  if (hidden) return null

  return (
    <PlayerTooltip
      className='max-w-[12.5rem]'
      content={<p>{tooltipTitle || ''}</p>}
      disabled={disabled || !tooltipTitle}
    >
      <button
        className={cn(
          'sm:text-[4rem] text-[2.5rem] flex items-center justify-center',
          'text-white w-[1em] h-[1em] bg-transparent',
          'outline-none border-none disabled:text-white/30',
          'disabled:cursor-default disabled:pointer-events-none',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-ring rounded-full',
          '[&_svg]:w-[1em] [&_svg]:h-[1em]',
          big && 'sm:text-[6rem] text-[3.5rem] mx-[0.8em]',
        )}
        disabled={disabled}
        onClick={onClick}
      >
        <IconSwap id={id}>{children}</IconSwap>
      </button>
    </PlayerTooltip>
  )
}
