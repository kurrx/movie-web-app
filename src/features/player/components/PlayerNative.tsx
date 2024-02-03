import ReactPlayer from 'react-player/file'

import { useNodes } from './PlayerNodes'
import { useProps } from './PlayerProps'

export function PlayerNative() {
  const { setPlayer } = useNodes()
  const { mediaUrl } = useProps()

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
      />
    </div>
  )
}
