import { PropsWithChildren } from 'react'

import { useAppSelector } from '@/hooks'

import { selectPlayerDesktopControlsVisible } from '../../../player.slice'

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
