import { useCallback, useMemo } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { PipOffIcon, PipOnIcon } from '@/assets'
import { useStore } from '@/hooks'

import {
  selectPlayerEnded,
  selectPlayerFullscreen,
  selectPlayerPip,
  setPlayerPip,
} from '../../../../player.slice'
import { Button } from './Button'

export function PipButton() {
  const [dispatch, selector] = useStore()
  const pip = selector(selectPlayerPip)
  const ended = selector(selectPlayerEnded)
  const fullscreen = selector(selectPlayerFullscreen)
  const id = useMemo(() => (pip ? 'pip-off' : 'pip-on'), [pip])
  const Icon = useMemo(() => (pip ? PipOffIcon : PipOnIcon), [pip])
  const tooltip = useMemo(() => (pip ? 'Exit Picture-in-Picture' : 'Picture-in-Picture'), [pip])
  const disabled = useMemo(() => ended || fullscreen, [ended, fullscreen])

  const togglePip = useCallback(() => {
    if (disabled) return
    dispatch(setPlayerPip((prev) => !prev))
  }, [dispatch, disabled])

  useHotkeys('i', togglePip, [togglePip])

  if (fullscreen || !document.pictureInPictureEnabled) return null

  return (
    <Button
      id={id}
      tooltip={tooltip}
      tooltipHotkey='I'
      tooltipDisabled={disabled}
      disabled={disabled}
      visible={!disabled}
      onClick={togglePip}
    >
      <Icon />
    </Button>
  )
}
