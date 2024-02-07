import { cn } from '@/api'
import { useAppSelector } from '@/hooks'

import { selectPlayerControlsVisible } from '../../../player.slice'

export function Overlay() {
  const controlsVisible = useAppSelector(selectPlayerControlsVisible)

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
