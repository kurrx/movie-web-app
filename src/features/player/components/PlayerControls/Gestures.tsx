import { MouseEvent, PointerEvent, useCallback, useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { selectDeviceIsMobile, selectDeviceIsTouch } from '@/features/device'
import { useElementRect, useStore } from '@/hooks'
import { PlayerSeek } from '@/types'

import { useFullscreen, useInteract, usePlaying } from '../../hooks'
import {
  endSeeking,
  seekTo,
  selectPlayerControlsVisible,
  selectPlayerFastForwarding,
  setPlayerFastForwarding,
  setPlayerInteracted,
} from '../../player.slice'
import { useNodes } from '../PlayerNodes'

export function Gestures() {
  const [dispatch, selector] = useStore()
  const { player } = useNodes()
  const isTouch = selector(selectDeviceIsTouch)
  const isMobile = selector(selectDeviceIsMobile)
  const fastForwarding = selector(selectPlayerFastForwarding)
  const controlsVisible = selector(selectPlayerControlsVisible)
  const ref = useRef<HTMLDivElement>(null)
  const rect = useElementRect(ref)
  const fastForwardingTimeout = useRef<NodeJS.Timeout | null>(null)
  const clickTimeout = useRef<NodeJS.Timeout | null>(null)
  const seekTimeout = useRef<NodeJS.Timeout | null>(null)
  const interact = useInteract()
  const { togglePlaying } = usePlaying()
  const { toggleFullscreen } = useFullscreen()

  const makeSeek = useCallback(
    (seek: NonNullable<PlayerSeek>) => {
      if (!player) return
      if (seekTimeout.current) {
        clearTimeout(seekTimeout.current)
        seekTimeout.current = null
      }
      dispatch(seekTo(seek))
      seekTimeout.current = setTimeout(() => {
        seekTimeout.current = null
        dispatch(endSeeking(player))
      }, 700)
    },
    [dispatch, player],
  )
  const seekBackward = useCallback(() => makeSeek('backward'), [makeSeek])
  const seekForward = useCallback(() => makeSeek('forward'), [makeSeek])

  const clearFastForwarding = useCallback(() => {
    if (fastForwardingTimeout.current) {
      clearTimeout(fastForwardingTimeout.current)
      fastForwardingTimeout.current = null
    }
    if (fastForwarding) {
      dispatch(setPlayerFastForwarding(false))
      return true
    }
    return false
  }, [dispatch, fastForwarding])

  const onSingleClick = useCallback(() => {
    if (isMobile) {
      if (controlsVisible) {
        dispatch(setPlayerInteracted(false))
      } else {
        interact()
      }
    } else {
      if (!isTouch || controlsVisible) {
        togglePlaying(true)
      } else {
        interact()
      }
    }
  }, [dispatch, togglePlaying, interact, isMobile, isTouch, controlsVisible])
  const onDoubleClick = useCallback(
    (e: PointerEvent) => {
      if (isTouch) {
        const region = (e.clientX - rect.x) / rect.width
        if (region > 0.3 && region < 0.7) {
          if (!seekTimeout.current) {
            toggleFullscreen()
          }
        } else {
          if (region <= 0.3) {
            makeSeek('backward')
          } else {
            makeSeek('forward')
          }
        }
      } else {
        toggleFullscreen()
      }
    },
    [toggleFullscreen, makeSeek, isTouch, rect],
  )

  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      clearFastForwarding()
      const target = e.target as HTMLElement
      target.setPointerCapture(e.pointerId)
      fastForwardingTimeout.current = setTimeout(() => {
        dispatch(setPlayerFastForwarding(true))
        fastForwardingTimeout.current = null
      }, 700)
      e.preventDefault()
    },
    [dispatch, clearFastForwarding],
  )
  const onPointerUp = useCallback(
    (e: PointerEvent) => {
      const target = e.target as HTMLElement
      if (clearFastForwarding()) return
      if (target.hasPointerCapture(e.pointerId)) {
        target.releasePointerCapture(e.pointerId)
        if (clickTimeout.current || seekTimeout.current) {
          if (clickTimeout.current) {
            clearTimeout(clickTimeout.current)
            clickTimeout.current = null
          }
          onDoubleClick(e)
          return
        }
        clickTimeout.current = setTimeout(() => {
          onSingleClick()
          clickTimeout.current = null
        }, 300)
        e.preventDefault()
      }
    },
    [clearFastForwarding, onSingleClick, onDoubleClick],
  )

  const onContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])
  const onPointerInteract = useCallback(() => {
    if (isTouch) return
    interact()
  }, [interact, isTouch])
  const onPointerCancelInteract = useCallback(
    (e: PointerEvent) => {
      if (clearFastForwarding()) return
      if (isTouch) return
      const [startX, endX] = [rect.x, rect.x + rect.width]
      const [startY, endY] = [rect.y, rect.y + rect.height]
      if (e.clientX < startX || e.clientX > endX || e.clientY < startY || e.clientY > endY) {
        dispatch(setPlayerInteracted(false))
      }
    },
    [dispatch, clearFastForwarding, isTouch, rect],
  )

  useHotkeys('left', seekBackward, { preventDefault: true }, [seekBackward])
  useHotkeys('right', seekForward, { preventDefault: true }, [seekForward])

  return (
    <div
      ref={ref}
      id='player-gestures'
      className='player-abs player-full'
      onContextMenu={onContextMenu}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerInteract}
      onPointerEnter={onPointerInteract}
      onPointerOver={onPointerInteract}
      onPointerLeave={onPointerCancelInteract}
      onPointerOut={onPointerCancelInteract}
    />
  )
}
