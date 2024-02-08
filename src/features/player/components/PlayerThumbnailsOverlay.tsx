import { useMemo, useRef } from 'react'

import { useAppSelector, useElementRect } from '@/hooks'

import {
  selectPlayerIsTimelineDragging,
  selectPlayerSeek,
  selectPlayerShowThumbnailsOverlay,
  selectPlayerThumbnailsOverlaySavedProgress,
} from '../player.slice'
import { useProps } from './PlayerProps'

export function PlayerThumbnailsOverlay() {
  const { thumbnails } = useProps()
  const ref = useRef<HTMLDivElement>(null)
  const rect = useElementRect(ref)
  const isTimelineDragging = useAppSelector(selectPlayerIsTimelineDragging)
  const seek = useAppSelector(selectPlayerSeek)
  const showThumbnailsOverlay = useAppSelector(selectPlayerShowThumbnailsOverlay)
  const thumbnailsProgress = useAppSelector(selectPlayerThumbnailsOverlaySavedProgress)
  const thumbnailsImage = useMemo(
    () => thumbnails.getOverlaySegment(thumbnailsProgress, rect.width, rect.height),
    [thumbnails, thumbnailsProgress, rect],
  )

  return (
    <div
      ref={ref}
      id='seek-overlay'
      className='absolute w-full h-full top-0 left-0 pointer-events-none select-none'
      style={{
        visibility:
          isTimelineDragging || showThumbnailsOverlay || seek !== null ? 'visible' : 'hidden',
      }}
    >
      <div
        id='seek-overlay-loader'
        className='absolute top-[50%] left-[50%] bg-black translate-x-[-50%] translate-y-[-50%]'
        style={{
          width: thumbnailsImage?.width,
          height: thumbnailsImage?.height,
        }}
      />
      <div
        id='seek-overlay-image'
        className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'
        style={thumbnailsImage}
      />
      <div
        id='seek-overlay-bg'
        className='absolute w-full h-full top-0 left-0 sm:bg-black/50 bg-black/0'
      />
    </div>
  )
}
