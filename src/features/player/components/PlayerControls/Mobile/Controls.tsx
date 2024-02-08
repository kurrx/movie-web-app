import { PropsWithChildren, useMemo } from 'react'

import { cn } from '@/api'
import { useAppSelector } from '@/hooks'

import {
  selectPlayerControlsVisible,
  selectPlayerIsTimelineDragging,
  selectPlayerSeek,
} from '../../../player.slice'

export function Top({ children }: PropsWithChildren) {
  const controlsVisible = useAppSelector(selectPlayerControlsVisible)
  const isTimelineDragging = useAppSelector(selectPlayerIsTimelineDragging)
  const visible = useMemo(
    () => controlsVisible && !isTimelineDragging,
    [controlsVisible, isTimelineDragging],
  )

  return (
    <div
      id='player-mobile-top-controls'
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

export function Center({ children }: PropsWithChildren) {
  const constrolsVisible = useAppSelector(selectPlayerControlsVisible)
  const seek = useAppSelector(selectPlayerSeek)
  const isTimelineDragging = useAppSelector(selectPlayerIsTimelineDragging)
  const visible = useMemo(
    () => constrolsVisible && seek === null && !isTimelineDragging,
    [constrolsVisible, seek, isTimelineDragging],
  )

  return (
    <div
      id='player-mobile-center-controls'
      className={cn(
        'absolute top-[50%] left-[50%] transition-opacity',
        'flex items-center justify-center translate-x-[-50%]',
        'data-[visible=false]:opacity-0 translate-y-[-50%]',
        'data-[visible=false]:pointer-events-none',
      )}
      data-visible={visible}
    >
      {children}
    </div>
  )
}

export function Bottom({ children }: PropsWithChildren) {
  const visible = useAppSelector(selectPlayerControlsVisible)

  return (
    <div
      id='player-mobile-bottom-controls'
      className={cn(
        'absolute left-0 bottom-0 transition-opacity',
        'data-[visible=false]:opacity-0 w-full',
        'data-[visible=false]:pointer-events-none',
      )}
      data-visible={visible}
    >
      {children}
    </div>
  )
}

export function BottomInfo({ children }: PropsWithChildren) {
  const hidden = useAppSelector(selectPlayerIsTimelineDragging)

  return (
    <div
      id='player-mobile-bottom-info-controls'
      className={cn(
        'flex items-center justify-between',
        'w-full pl-7 pr-3 mb-[-0.8125rem]',
        'data-[hidden=true]:hidden',
      )}
      data-hidden={hidden}
    >
      {children}
    </div>
  )
}

export const Controls = { Top, Center, Bottom, BottomInfo }
