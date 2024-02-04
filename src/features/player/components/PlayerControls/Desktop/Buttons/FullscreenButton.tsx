import { useMemo } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { FullscreenOffIcon, FullscreenOnIcon } from '@/assets'
import { useAppSelector } from '@/hooks'

import { useFullscreen } from '../../../../hooks'
import { selectPlayerFullscreen } from '../../../../player.slice'
import { Button } from './Button'

export function FullscreenButton() {
  const fullscreen = useAppSelector(selectPlayerFullscreen)
  const { toggleFullscreen } = useFullscreen()
  const id = useMemo(() => (fullscreen ? 'fs-off' : 'fs-on'), [fullscreen])
  const Icon = useMemo(() => (fullscreen ? FullscreenOffIcon : FullscreenOnIcon), [fullscreen])
  const tooltip = useMemo(() => (fullscreen ? 'Exit fullscreen' : 'Fullscreen'), [fullscreen])

  useHotkeys('f', toggleFullscreen, { enabled: (e) => e.code === 'KeyF' }, [toggleFullscreen])

  return (
    <Button id={id} tooltip={tooltip} tooltipHotkey='F' onClick={toggleFullscreen}>
      <Icon />
    </Button>
  )
}
