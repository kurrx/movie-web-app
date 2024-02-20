import './Timeline.css'

import { motion, useMotionValue } from 'framer-motion'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { PointerEvent, useCallback, useEffect, useMemo, useRef } from 'react'

import { clamp, convertSeconds } from '@/api'
import { useElementRect, useStore } from '@/hooks'

import {
  endDragging,
  endHovering,
  selectPlayerDuration,
  selectPlayerHoverProgress,
  selectPlayerIsTimelineDragging,
  selectPlayerIsTimelineHovering,
  selectPlayerLoadedProgress,
  selectPlayerMenu,
  selectPlayerThumbnailsProgress,
  selectPlayerTime,
  startDragging,
  startHovering,
  timelineMove,
} from '../../../../player.slice'
import { useNodes } from '../../../PlayerNodes'
import { useProps } from '../../../PlayerProps'

export function Timeline() {
  const [dispatch, selector] = useStore()
  const { player } = useNodes()
  const { thumbnails } = useProps()
  const ref = useRef<HTMLDivElement>(null)
  const rect = useElementRect(ref)
  const thumbnailsRef = useRef<HTMLDivElement>(null)
  const thumbnailsRect = useElementRect(thumbnailsRef)
  const time = selector(selectPlayerTime)
  const loadedProgress = selector(selectPlayerLoadedProgress)
  const duration = selector(selectPlayerDuration)
  const isTimelineHovering = selector(selectPlayerIsTimelineHovering)
  const isTimelineDragging = selector(selectPlayerIsTimelineDragging)
  const menu = selector(selectPlayerMenu)
  const hoverProgress = selector(selectPlayerHoverProgress)
  const thumbnaisProgress = selector(selectPlayerThumbnailsProgress)
  const thumbnailsImage = useMemo(
    () => thumbnails.getPreviewSegment(thumbnaisProgress, rect.width * 0.18),
    [thumbnails, thumbnaisProgress, rect],
  )
  const timeScaleX = useMotionValue(0)
  const timeDotX = useMotionValue(0)
  const loadedProgressScaleX = useMotionValue(0)
  const hoverProgressScaleX = useMotionValue(0)
  const thumbnailsProgressX = useMotionValue(0)

  const getTimeFromEvent = useCallback(
    ({ clientX }: PointerEvent | MouseEvent) => {
      const percent = (clientX - rect.x) / rect.width
      const time = percent * duration
      return clamp(time, 0, duration - 1)
    },
    [rect, duration],
  )
  const onHoverStart = useCallback(
    (e: MouseEvent) => {
      const time = getTimeFromEvent(e)
      dispatch(startHovering(time))
    },
    [dispatch, getTimeFromEvent],
  )
  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      const target = e.target as HTMLElement
      const time = getTimeFromEvent(e)
      target.setPointerCapture(e.pointerId)
      dispatch(startDragging(time))
      e.preventDefault()
    },
    [dispatch, getTimeFromEvent],
  )
  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      const time = getTimeFromEvent(e)
      dispatch(timelineMove(time))
    },
    [dispatch, getTimeFromEvent],
  )
  const onHoverEnd = useCallback(() => {
    dispatch(endHovering())
  }, [dispatch])
  const onPointerUp = useCallback(
    (e: PointerEvent) => {
      const target = e.target as HTMLElement
      if (target.hasPointerCapture(e.pointerId)) {
        target.releasePointerCapture(e.pointerId)
      }
      if (isTimelineDragging) {
        const time = getTimeFromEvent(e)
        dispatch(endDragging())
        if (player) {
          player.seekTo(time, 'seconds')
        }
      }
    },
    [dispatch, getTimeFromEvent, player, isTimelineDragging],
  )
  const onContextMenu = useCallback((e: ReactMouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  useEffect(() => {
    timeScaleX.set(time / duration)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, duration])

  useEffect(() => {
    timeDotX.set((time / duration) * rect.width)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, duration, rect])

  useEffect(() => {
    loadedProgressScaleX.set(loadedProgress / duration)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedProgress, duration])

  useEffect(() => {
    hoverProgressScaleX.set(hoverProgress / duration)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoverProgress, duration])

  useEffect(() => {
    const next = (thumbnaisProgress / duration) * rect.width - thumbnailsRect.width / 2
    const max = rect.width - thumbnailsRect.width
    thumbnailsProgressX.set(clamp(next, 0, max))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thumbnaisProgress, duration, rect, thumbnailsRect])

  return (
    <motion.div
      ref={ref}
      className='timeline-container'
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onContextMenu={onContextMenu}
    >
      <div className='timeline-progress'>
        <div className='timeline-progress-container'>
          <div className='timeline-progress-hover-container'>
            <div className='timeline-progress-padding' />
            <div className='timeline-progress-list'>
              <motion.div className='timeline-play-progress' style={{ scaleX: timeScaleX }} />
              <motion.div
                className='timeline-load-progress'
                style={{ scaleX: loadedProgressScaleX }}
              />
              <motion.div
                className='timeline-hover-progress'
                style={{ scaleX: hoverProgressScaleX }}
              />
            </div>
          </div>
        </div>
        <motion.div className='timeline-scrubber-container' style={{ x: timeDotX }}>
          <div className='timeline-scrubber-button' />
        </motion.div>
      </div>
      <motion.div
        ref={thumbnailsRef}
        className='timeline-thumbnails'
        style={{
          visibility:
            (isTimelineHovering || isTimelineDragging) && menu === null ? 'visible' : 'hidden',
          y: '-100%',
          x: thumbnailsProgressX,
        }}
      >
        <div className='timeline-thumbnails-image-container'>
          <div className='timeline-thumbnails-image' style={thumbnailsImage} />
        </div>
        <div className='timeline-thumbnails-time'>{convertSeconds(thumbnaisProgress)}</div>
      </motion.div>
    </motion.div>
  )
}
