import { PropsWithChildren } from 'react'

import { useAppSelector } from '@/hooks'

import { selectPlayerDesktopMouseVisible } from '../../../player.slice'

export function Wrapper({ children }: PropsWithChildren) {
  const visible = useAppSelector(selectPlayerDesktopMouseVisible)

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
