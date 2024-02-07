import { PropsWithChildren } from 'react'

import { cn } from '@/api'
import { useAppSelector } from '@/hooks'

import { selectPlayerControlsVisible } from '../../../player.slice'

export function Top({ children }: PropsWithChildren) {
  const visible = useAppSelector(selectPlayerControlsVisible)

  return (
    <div
      id='player-mobile-controls'
      className={cn(
        'absolute right-0 top-0 transition-opacity',
        'flex items-center justify-end',
        'data-[visible=false]:opacity-0',
        'data-[visible=false]:pointer-events-none',
      )}
      data-visible={visible}
    >
      {children}
    </div>
  )
}

export const Controls = { Top }
