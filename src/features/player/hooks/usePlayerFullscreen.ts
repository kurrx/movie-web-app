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
    const onOrientationChange = () => {
      if (window.screen.orientation.type.includes('landscape')) {
        enterFullscreen()
      } else {
        exitFullscreen()
      }
    }
    window.screen.orientation.addEventListener('change', onOrientationChange)
    return () => {
      window.screen.orientation.removeEventListener('change', onOrientationChange)
    }
  }, [isMobile, enterFullscreen, exitFullscreen])
}
