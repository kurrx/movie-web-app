import { MouseEvent, PointerEvent, useCallback, useRef } from 'react'

import { selectDeviceIsMobile, selectDeviceIsTouch } from '@/features/device'
import { useElementRect, useStore } from '@/hooks'

import { useFullscreen, useInteract, usePlaying } from '../../hooks'
import {
  selectPlayerDesktopControlsVisible,
  selectPlayerFastForwarding,
  setPlayerFastForwarding,
  setPlayerInteracted,
} from '../../player.slice'

export function Gestures() {
  const [dispatch, selector] = useStore()
  const isTouch = selector(selectDeviceIsTouch)
  const isMobile = selector(selectDeviceIsMobile)
  const fastForwarding = selector(selectPlayerFastForwarding)
  const controlsVisible = selector(selectPlayerDesktopControlsVisible)
  const ref = useRef<HTMLDivElement>(null)
  const rect = useElementRect(ref)
  const fastForwardingTimeout = useRef<NodeJS.Timeout | null>(null)
  const singleClickTimeout = useRef<NodeJS.Timeout | null>(null)
  const doubleClickTimeout = useRef<NodeJS.Timeout | null>(null)
  const interact = useInteract()
  const { togglePlaying } = usePlaying()
  const { toggleFullscreen } = useFullscreen()

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
      if (doubleClickTimeout.current) {
        clearTimeout(doubleClickTimeout.current)
        doubleClickTimeout.current = null
      }
      if (isTouch) {
        const region = (e.clientX - rect.x) / rect.width
        if (region > 0.3 && region < 0.7) {
          toggleFullscreen()
        } else {
          doubleClickTimeout.current = setTimeout(() => {
            doubleClickTimeout.current = null
          }, 700)
          if (region <= 0.3) {
            console.log('backward')
          } else {
            console.log('forward')
          }
        }
      } else {
        toggleFullscreen()
      }
    },
    [toggleFullscreen, isTouch, rect],
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
        if (singleClickTimeout.current || doubleClickTimeout.current) {
          if (singleClickTimeout.current) {
            clearTimeout(singleClickTimeout.current)
            singleClickTimeout.current = null
          }
          onDoubleClick(e)
          return
        }
        singleClickTimeout.current = setTimeout(() => {
          onSingleClick()
          singleClickTimeout.current = null
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
