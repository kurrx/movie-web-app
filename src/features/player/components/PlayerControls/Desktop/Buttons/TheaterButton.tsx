import { useCallback, useMemo } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { TheaterOffIcon, TheaterOnIcon } from '@/assets'
import { useStore } from '@/hooks'

import {
  selectPlayerFullscreen,
  selectPlayerTheater,
  setPlayerTheater,
} from '../../../../player.slice'
import { Button } from './Button'

export function TheaterButton() {
  const [dispatch, selector] = useStore()
  const theater = selector(selectPlayerTheater)
  const fullscreen = selector(selectPlayerFullscreen)
  const id = useMemo(() => (theater ? 'theater-off' : 'theater-on'), [theater])
  const Icon = useMemo(() => (theater ? TheaterOffIcon : TheaterOnIcon), [theater])
  const tooltip = useMemo(() => (theater ? 'Regular Mode' : 'Theater Mode'), [theater])

  const toggleTheater = useCallback(() => {
    if (fullscreen) return
    dispatch(setPlayerTheater((prev) => !prev))
  }, [dispatch, fullscreen])

  useHotkeys('t', toggleTheater, [toggleTheater])

  return (
    <Button
      id={id}
      tooltip={tooltip}
      tooltipHotkey='T'
      tooltipDisabled={fullscreen}
      disabled={fullscreen}
      visible={!fullscreen}
      onClick={toggleTheater}
    >
      <Icon />
    </Button>
  )
}
