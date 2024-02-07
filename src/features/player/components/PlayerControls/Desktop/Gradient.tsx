import { useMemo } from 'react'

import { cn } from '@/api'
import { useAppSelector } from '@/hooks'

import { selectPlayerControlsVisible, selectPlayerHeadingVisible } from '../../../player.slice'

export interface GradientProps {
  position: 'top' | 'bottom'
}

export function Gradient({ position }: GradientProps) {
  const headingVisible = useAppSelector(selectPlayerHeadingVisible)
  const controlsVisible = useAppSelector(selectPlayerControlsVisible)
  const visible = useMemo(
    () => (position === 'top' ? headingVisible : controlsVisible),
    [headingVisible, controlsVisible, position],
  )

  return (
    <div
      id={`player-${position}-gradient`}
      className={cn(
        'absolute w-full h-[30%] pointer-events-none',
        'transition-opacity data-[visible=false]:opacity-0',
      )}
      style={{
        top: position === 'top' ? 0 : 'auto',
        bottom: position === 'bottom' ? 0 : 'auto',
        background: `linear-gradient(to ${position}, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%)`,
      }}
      data-visible={visible}
    />
  )
}
