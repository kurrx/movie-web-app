import { useMemo } from 'react'

import { FullscreenOffThinIcon, FullscreenOnThinIcon } from '@/assets'
import { IconSwap } from '@/components'
import { useAppSelector } from '@/hooks'

import { useFullscreen } from '../../../hooks'
import { selectPlayerFullscreen } from '../../../player.slice'

export function FullscreenButton() {
  const fullscreen = useAppSelector(selectPlayerFullscreen)
  const { toggleFullscreen } = useFullscreen()
  const id = useMemo(() => (fullscreen ? 'fs-off' : 'fs-on'), [fullscreen])
  const Icon = useMemo(
    () => (fullscreen ? FullscreenOffThinIcon : FullscreenOnThinIcon),
    [fullscreen],
  )

  return (
    <button
      className='w-[2.75rem] h-[2.75rem] flex items-center justify-center text-white'
      onClick={toggleFullscreen}
    >
      <IconSwap id={id}>
        <Icon className='w-[1.5rem] h-[1.5rem]' />
      </IconSwap>
    </button>
  )
}
