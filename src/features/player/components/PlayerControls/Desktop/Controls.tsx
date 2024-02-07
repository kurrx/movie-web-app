import { PropsWithChildren } from 'react'

import { cn } from '@/api'
import { useAppSelector } from '@/hooks'

import { selectPlayerControlsVisible } from '../../../player.slice'

function Root({ children }: PropsWithChildren) {
  const visible = useAppSelector(selectPlayerControlsVisible)

  return (
    <div
      id='player-controls'
      className={cn(
        'absolute left-0 bottom-0 transition-opacity',
        'data-[visible=false]:opacity-0 w-full px-3',
        'data-[visible=false]:pointer-events-none',
      )}
      data-visible={visible}
    >
      {children}
    </div>
  )
}

function Buttons({ children }: PropsWithChildren) {
  return (
    <div id='player-controls-buttons' className='flex items-center justify-between'>
      {children}
    </div>
  )
}

export interface ControlsSideProps extends PropsWithChildren {
  side: 'left' | 'right'
}

function Side({ side, children }: ControlsSideProps) {
  return (
    <div
      id={`player-controls-buttons-${side}`}
      className={cn(
        'flex items-center',
        side === 'left' && 'justify-start flex-1',
        side === 'right' && 'justify-end shrink-0',
      )}
    >
      {children}
    </div>
  )
}

export const Controls = { Root, Buttons, Side }
