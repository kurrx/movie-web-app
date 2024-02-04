import { useEffect } from 'react'
import screenfull from 'screenfull'

import { useStore } from '@/hooks'

import { selectPlayerFullscreen, setPlayerFullscreen } from '../player.slice'

export function usePlayerFullscreen() {
  const [dispatch, selector] = useStore()
  const fullscreen = selector(selectPlayerFullscreen)

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
}
