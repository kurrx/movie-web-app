import { cn } from '@/api'
import { useAppSelector } from '@/hooks'

import { selectPlayerDesktopControlsVisible } from '../../../player.slice'

export function Overlay() {
  const controlsVisible = useAppSelector(selectPlayerDesktopControlsVisible)

  return (
    <div
      id='player-mobile-overlay'
      className={cn(
        'player-abs player-full pointer-events-none bg-black opacity-50',
        'transition-opacity data-[visible=false]:opacity-0',
      )}
      data-visible={controlsVisible}
    />
  )
}
