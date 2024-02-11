import { useEffect } from 'react'
import screenfull from 'screenfull'

import { selectDeviceIsMobile } from '@/features/device'
import { useStore } from '@/hooks'

import { selectPlayerFullscreen, setPlayerFullscreen } from '../player.slice'
import { useFullscreen } from './useFullscreen'

export function usePlayerFullscreen() {
  const [dispatch, selector] = useStore()
  const isMobile = selector(selectDeviceIsMobile)
  const fullscreen = selector(selectPlayerFullscreen)
  const { enterFullscreen, exitFullscreen } = useFullscreen()

  useEffect(() => {
    if (screenfull.isEnabled) {
      const onFullscreenChange = () => {
        dispatch(setPlayerFullscreen(screenfull.isFullscreen))
      }
      screenfull.on('change', onFullscreenChange)
      return () => {
        screenfull.off('change', onFullscreenChange)
      }
    }
  }, [dispatch])

  useEffect(() => {
    if (fullscreen) {
      document.documentElement.classList.add('fullscreen')
    } else {
      document.documentElement.classList.remove('fullscreen')
    }
    return () => {
      document.documentElement.classList.remove('fullscreen')
    }
  }, [fullscreen])

  useEffect(() => {
    if (!isMobile) return
    const screenApi = window.screen || screen
    if (!screenApi) return
    if (!screenApi.orientation) return
    const onOrientationChange = () => {
      if (screenApi.orientation.type.includes('landscape')) {
        enterFullscreen()
      } else {
        exitFullscreen()
      }
    }
    screenApi.orientation.addEventListener('change', onOrientationChange)
    return () => {
      screenApi.orientation.removeEventListener('change', onOrientationChange)
    }
  }, [isMobile, enterFullscreen, exitFullscreen])
}
