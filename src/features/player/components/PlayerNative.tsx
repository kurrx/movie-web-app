import ReactPlayer from 'react-player/file'

import { useStore } from '@/hooks'

import { selectPlayerMuted, selectPlayerVolume } from '../player.slice'
import { useNodes } from './PlayerNodes'
import { useProps } from './PlayerProps'

export function PlayerNative() {
  const [dispatch, selector] = useStore()
  const { setPlayer } = useNodes()
  const { mediaUrl } = useProps()
  const volume = selector(selectPlayerVolume)
  const muted = selector(selectPlayerMuted)

  return (
    <div className='player-wrapper'>
      <ReactPlayer
        ref={setPlayer}
        className='player'
        width='100%'
        height='100%'
        url={mediaUrl}
        controls={false}
        playsinline={true}
        loop={false}
        stopOnUnmount={false}
        config={{
          forceHLS: true,
          forceSafariHLS: true,
          hlsVersion: '1.4.10',
        }}
        volume={volume / 100}
        muted={muted}
      />
    </div>
  )
}
