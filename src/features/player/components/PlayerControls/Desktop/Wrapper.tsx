import { PropsWithChildren } from 'react'

import { selectPlayerDesktopControlsVisible } from '@/features/player/player.slice'
import { useAppSelector } from '@/hooks'

export function Wrapper({ children }: PropsWithChildren) {
  const visible = useAppSelector(selectPlayerDesktopControlsVisible)

  return (
    <div
      id='player-desktop-controls'
      className={'player-abs player-full data-[visible="false"]:cursor-none'}
      data-visible={visible}
    >
      {children}
    </div>
  )
}
