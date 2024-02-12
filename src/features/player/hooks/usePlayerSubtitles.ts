import { useEffect } from 'react'

import { useNodes } from '../components/PlayerNodes'
import { useProps } from '../components/PlayerProps'

export function usePlayerSubtitles() {
  const { video } = useNodes()
  const { subtitle, onSubtitleChange } = useProps()

  useEffect(() => {
    if (!video) return
    if (!video.textTracks) return
    for (let i = 0; i < video.textTracks.length; i++) {
      const track = video.textTracks[i]
      if (track.language === subtitle) {
        track.mode = 'showing'
      } else {
        track.mode = 'disabled'
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtitle])

  useEffect(() => {
    if (!video) return
    if (!video.textTracks) return
    const onChange = () => {
      let track: TextTrack | null = null
      for (let i = 0; i < video.textTracks.length; i++) {
        if (video.textTracks[i].mode === 'showing') {
          track = video.textTracks[i]
          break
        }
      }
      onSubtitleChange(track?.language || null)
    }
    video.textTracks.addEventListener('change', onChange)
    return () => {
      video.textTracks.removeEventListener('change', onChange)
    }
  }, [video, onSubtitleChange])
}
