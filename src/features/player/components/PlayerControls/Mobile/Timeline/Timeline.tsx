import './Timeline.css'

import { motion, useMotionValue } from 'framer-motion'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { PointerEvent, useCallback, useEffect, useMemo, useRef } from 'react'

import { clamp, convertSeconds } from '@/api'
import { useElementRect, useStore } from '@/hooks'

import {
  endDragging,
  selectPlayerDuration,
  selectPlayerIsTimelineDragging,
  selectPlayerLoadedProgress,
  selectPlayerTime,
  startDragging,
  timelineMove,
} from '../../../../player.slice'
import { useNodes } from '../../../PlayerNodes'

export function Timeline() {
  const [dispatch, selector] = useStore()
  const { player } = useNodes()
  const ref = useRef<HTMLDivElement>(null)
  const rect = useElementRect(ref)
  const time = selector(selectPlayerTime)
  const loadedProgress = selector(selectPlayerLoadedProgress)
  const duration = selector(selectPlayerDuration)
  const isTimelineDragging = selector(selectPlayerIsTimelineDragging)
  const timeScaleX = useMotionValue(0)
  const timeDotX = useMotionValue(0)
  const loadedProgressScaleX = useMotionValue(0)
  const timeStr = useMemo(() => convertSeconds(clamp(time, 0, duration)), [time, duration])

  const getTimeFromEvent = useCallback(
    ({ clientX }: PointerEvent | MouseEvent) => {
      const percent = (clientX - rect.x) / rect.width
      const time = percent * duration
      return clamp(time, 0, duration - 1)
    },
    [rect, duration],
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

  return (
    <div className='mobile-timeline-container' data-dragging={isTimelineDragging}>
      <motion.div
        ref={ref}
        className='mobile-timeline-progress'
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onContextMenu={onContextMenu}
      >
        <div className='mobile-timeline-progress-lines'>
          <motion.div
            className='mobile-timeline-load-progress'
            style={{ scaleX: loadedProgressScaleX }}
          />
          <motion.div className='mobile-timeline-play-progress' style={{ scaleX: timeScaleX }} />
        </div>
        <motion.div
          className='mobile-timeline-scrubber-container'
          style={{ y: '-50%', x: timeDotX }}
        >
          <div className='mobile-timeline-scrubber-button' />
        </motion.div>
      </motion.div>
      <div className='mobile-timeline-timer' data-visible={isTimelineDragging}>
        {timeStr}
      </div>
    </div>
  )
}
