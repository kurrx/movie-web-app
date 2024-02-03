import { PropsWithChildren } from 'react'

import { cn } from '@/api'
import { selectPlayerDesktopControlsVisible } from '@/features/player/player.slice'
import { useAppSelector } from '@/hooks'

function Root({ children }: PropsWithChildren) {
  const visible = useAppSelector(selectPlayerDesktopControlsVisible)

  return (
    <div
      id='player-bottom-controls'
      className={cn(
        'absolute left-0 bottom-0 transition-opacity',
        'data-[visible="false"]:opacity-0 w-full px-3',
        'data-[visible="false"]:pointer-events-none',
      )}
      data-visible={visible}
    >
      {children}
    </div>
  )
}

function Buttons({ children }: PropsWithChildren) {
  return <div className='flex items-center justify-between'>{children}</div>
}

function ButtonsLeft({ children }: PropsWithChildren) {
  return <div className='flex items-center flex-1 justify-start'>{children}</div>
}

function ButtonsRight({ children }: PropsWithChildren) {
  return <div className='flex items-center shrink-0 justify-end'>{children}</div>
}

export const BottomControls = { Root, Buttons, ButtonsLeft, ButtonsRight }
