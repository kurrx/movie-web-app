import { useMemo } from 'react'

import { NextPlayIcon, ReplayIcon } from '@/assets'
import { WatchPlaylistPlayItem } from '@/types'

import { EndingButton } from './EndingButton'

export interface EndingReplayProps {
  prev: WatchPlaylistPlayItem | null
  canPlayPrev: boolean
  next: WatchPlaylistPlayItem | null
  canPlayNext: boolean
  onReplay: () => void
  onPlayPrev: () => void
  onPlayNext: () => void
}

export function EndingReplay(props: EndingReplayProps) {
  const { prev, canPlayPrev, next, canPlayNext, onReplay, onPlayPrev, onPlayNext } = props
  const hidePrevNext = useMemo(() => !canPlayPrev && !canPlayNext, [canPlayPrev, canPlayNext])

  return (
    <div className='flex items-center justify-center'>
      <EndingButton
        id='play-prev'
        disabled={!canPlayPrev}
        tooltipTitle={prev?.title || 'Previous'}
        hidden={hidePrevNext}
        onClick={onPlayPrev}
      >
        <NextPlayIcon className='rotate-180' />
      </EndingButton>
      <EndingButton big id='replay' tooltipTitle='Replay' onClick={onReplay}>
        <ReplayIcon />
      </EndingButton>
      <EndingButton
        id='play-next'
        disabled={!canPlayNext}
        tooltipTitle={next?.title || 'Next'}
        hidden={hidePrevNext}
        onClick={onPlayNext}
      >
        <NextPlayIcon />
      </EndingButton>
    </div>
  )
}
