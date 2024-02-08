import { useCallback, useMemo } from 'react'

import { cn } from '@/api'
import { selectDeviceIsMobile } from '@/features/device'
import { useStore } from '@/hooks'

import { usePlaying } from '../../../hooks'
import { selectPlayerAutoPlay, selectPlayerEnded, setPlayerAutoPlay } from '../../../player.slice'
import { useProps } from '../../PlayerProps'
import { EndingNext } from './EndingNext'
import { EndingReplay } from './EndingReplay'

const classes = {
  root: cn(
    'absolute top-0 left-0 bottom-0 right-0',
    'w-full h-full flex flex-col justify-center',
    'items-center bg-black dark',
  ),
}

export function Ending() {
  const [dispatch, selector] = useStore()
  const { playlistAdjacents, onPlayItem } = useProps()
  const ended = selector(selectPlayerEnded)
  const autoPlay = selector(selectPlayerAutoPlay)
  const isMobile = selector(selectDeviceIsMobile)
  const prev = useMemo(() => playlistAdjacents.prev, [playlistAdjacents])
  const next = useMemo(() => playlistAdjacents.next, [playlistAdjacents])
  const canPlayPrev = useMemo(() => !!prev, [prev])
  const canPlayNext = useMemo(() => !!next, [next])
  const { replay } = usePlaying()

  const onCancel = useCallback(() => {
    dispatch(setPlayerAutoPlay(false))
  }, [dispatch])
  const onPlayPrev = useCallback(() => {
    if (!prev) return
    onPlayItem(prev)
  }, [onPlayItem, prev])
  const onPlayNext = useCallback(() => {
    if (!next) return
    onPlayItem(next)
  }, [onPlayItem, next])
  const onReplay = useCallback(() => replay(false), [replay])

  if (!ended) return null

  if (autoPlay && next) {
    return (
      <div id='player-ending' className={classes.root}>
        <EndingNext next={next} onPlayNext={onPlayNext} onCancel={onCancel} />
      </div>
    )
  }

  if (isMobile) return null

  return (
    <div id='player-ending' className={classes.root}>
      <EndingReplay
        prev={prev}
        canPlayPrev={canPlayPrev}
        next={next}
        canPlayNext={canPlayNext}
        onReplay={onReplay}
        onPlayPrev={onPlayPrev}
        onPlayNext={onPlayNext}
      />
    </div>
  )
}
