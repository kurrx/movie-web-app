/* eslint-disable @typescript-eslint/no-explicit-any */
import { SetStateAction, useCallback } from 'react'
import screenfull from 'screenfull'

import { noop } from '@/api'

import { useNodes } from '../components/PlayerNodes'

export function useFullscreen() {
  const { container, video } = useNodes()

  const setFullscreen = useCallback(
    (value: SetStateAction<boolean>) => {
      if (!container || !video) return
      const next = typeof value === 'function' ? value(screenfull.isFullscreen) : value
      if (next) {
        if (screenfull.isEnabled) {
          screenfull.request(container).catch(noop)
        } else if (typeof (video as any).webkitEnterFullscreen === 'function') {
          const promise = (video as any).webkitEnterFullscreen()
          if (typeof promise?.catch === 'function') {
            promise.catch(noop)
          }
        }
      } else {
        if (screenfull.isEnabled) {
          screenfull.exit().catch(noop)
        } else if (typeof (video as any).webkitExitFullscreen === 'function') {
          const promise = (video as any).webkitExitFullscreen()
          if (typeof promise?.catch === 'function') {
            promise.catch(noop)
          }
        }
      }
    },
    [container, video],
  )
  const enterFullscreen = useCallback(() => setFullscreen(true), [setFullscreen])
  const exitFullscreen = useCallback(() => setFullscreen(false), [setFullscreen])
  const toggleFullscreen = useCallback(() => setFullscreen((prev) => !prev), [setFullscreen])

  return { setFullscreen, enterFullscreen, exitFullscreen, toggleFullscreen }
}
