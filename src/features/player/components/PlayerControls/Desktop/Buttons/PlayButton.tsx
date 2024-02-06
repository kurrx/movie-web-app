import { useCallback, useMemo, useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { PauseIcon, PlayIcon, ReplayIcon } from '@/assets'
import { useStore } from '@/hooks'

import { usePlaying } from '../../../../hooks'
import {
  selectPlayerEnded,
  selectPlayerFastForwarding,
  selectPlayerPlayingCombined,
  setPlayerFastForwarding,
  setPlayerPlayingWithAction,
} from '../../../../player.slice'
import { Button } from './Button'

export function PlayButton() {
  const [dispatch, selector] = useStore()
  const playing = selector(selectPlayerPlayingCombined)
  const ended = selector(selectPlayerEnded)
  const fastForwarding = selector(selectPlayerFastForwarding)
  const timeout = useRef<NodeJS.Timeout | null>(null)
  const id = useMemo(() => {
    if (ended) return 'Replay'
    return playing ? 'Pause' : 'Play'
  }, [playing, ended])
  const Icon = useMemo(() => {
    switch (id) {
      case 'Replay':
        return ReplayIcon
      case 'Pause':
        return PauseIcon
      case 'Play':
        return PlayIcon
    }
  }, [id])
  const { onClick, onKeyClick } = usePlaying()

  const onSpaceDown = useCallback(
    (e: KeyboardEvent) => {
      if (document.activeElement !== document.body) return
      e.preventDefault()
      e.stopImmediatePropagation()
      if (timeout.current) {
        clearTimeout(timeout.current)
        timeout.current = null
      }
      timeout.current = setTimeout(() => {
        dispatch(setPlayerFastForwarding(true))
        timeout.current = null
      }, 700)
    },
    [dispatch],
  )
  const onSpaceUp = useCallback(
    (e: KeyboardEvent) => {
      if (document.activeElement !== document.body) return
      e.preventDefault()
      e.stopImmediatePropagation()
      if (timeout.current) {
        clearTimeout(timeout.current)
        timeout.current = null
      }
      if (fastForwarding) {
        dispatch(setPlayerFastForwarding(false))
      } else {
        dispatch(setPlayerPlayingWithAction((prev) => !prev))
      }
    },
    [dispatch, fastForwarding],
  )

  useHotkeys('k', onKeyClick, [onKeyClick])
  useHotkeys('space', onSpaceDown, { keydown: true }, [onSpaceDown])
  useHotkeys('space', onSpaceUp, { keyup: true }, [onSpaceUp])

  return (
    <Button id={id} tooltip={id} tooltipHotkey='K' onClick={onClick}>
      <Icon className='!w-11 !h-11' />
    </Button>
  )
}
