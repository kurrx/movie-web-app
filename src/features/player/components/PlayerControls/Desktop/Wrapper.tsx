import { FocusEvent, PropsWithChildren, useCallback, useEffect, useRef } from 'react'

import { useStore } from '@/hooks'

import { useInteract } from '../../../hooks'
import {
  selectPlayerFastForwarding,
  selectPlayerFullscreen,
  selectPlayerMenu,
  selectPlayerMouseVisible,
  selectPlayerPlayingCombined,
  setPlayerFocused,
} from '../../../player.slice'

export function Wrapper({ children }: PropsWithChildren) {
  const [dispatch, selector] = useStore()
  const interact = useInteract()
  const visible = selector(selectPlayerMouseVisible)
  const playing = selector(selectPlayerPlayingCombined)
  const fullscreen = selector(selectPlayerFullscreen)
  const menu = selector(selectPlayerMenu)
  const fastForwarding = selector(selectPlayerFastForwarding)
  const downRef = useRef(false)

  const onPointerChange = useCallback((down: boolean) => {
    downRef.current = down
  }, [])
  const onPointerDown = useCallback(() => onPointerChange(true), [onPointerChange])
  const onPointerUp = useCallback(() => onPointerChange(false), [onPointerChange])

  const onFocus = useCallback(
    (e: FocusEvent) => {
      if (downRef.current) {
        const target = e.target
        interact()
        if (target instanceof HTMLElement) {
          target.blur()
        }
      } else {
        dispatch(setPlayerFocused(true))
      }
    },
    [dispatch, interact],
  )
  const onBlur = useCallback(() => {
    dispatch(setPlayerFocused(false))
  }, [dispatch])

  useEffect(interact, [interact, playing, fullscreen, menu, fastForwarding])

  return (
    <div
      id='player-desktop-controls'
      className='player-abs player-full data-[visible=false]:cursor-none'
      data-visible={visible}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {children}
    </div>
  )
}
