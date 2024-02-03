import { useMemo } from 'react'

import { cn } from '@/api'
import { useAppSelector } from '@/hooks'

import {
  selectPlayerDesktopControlsVisible,
  selectPlayerDesktopTopVisible,
} from '../../../player.slice'

export interface GradientProps {
  position: 'top' | 'bottom'
}

export function Gradient({ position }: GradientProps) {
  const topVisible = useAppSelector(selectPlayerDesktopTopVisible)
  const controlsVisible = useAppSelector(selectPlayerDesktopControlsVisible)
  const visible = useMemo(
    () => (position === 'top' ? topVisible : controlsVisible),
    [topVisible, controlsVisible, position],
  )

  return (
    <div
      id={`player-${position}-gradient`}
      className={cn(
        'absolute w-full h-[30%] pointer-events-none',
        'transition-opacity data-[visible="false"]:opacity-0',
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
