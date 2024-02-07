import { PropsWithChildren, useEffect } from 'react'

import { useAppSelector } from '@/hooks'

import { useInteract } from '../../../hooks'
import {
  selectPlayerFastForwarding,
  selectPlayerFullscreen,
  selectPlayerMenu,
  selectPlayerPlayingCombined,
} from '../../../player.slice'

export function Wrapper({ children }: PropsWithChildren) {
  const interact = useInteract()
  const playing = useAppSelector(selectPlayerPlayingCombined)
  const fullscreen = useAppSelector(selectPlayerFullscreen)
  const menu = useAppSelector(selectPlayerMenu)
  const fastForwarding = useAppSelector(selectPlayerFastForwarding)

  useEffect(interact, [interact, playing, fullscreen, menu, fastForwarding])

  return (
    <div id='player-mobile-controls' className='player-abs player-full'>
      {children}
    </div>
  )
}
