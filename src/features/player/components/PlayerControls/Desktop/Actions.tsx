import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useMemo } from 'react'

import { cn } from '@/api'
import {
  PauseIcon,
  PlayIcon,
  VolumeModerateIcon,
  VolumeMutedIcon,
  VolumeNormalIcon,
} from '@/assets'
import { useStore } from '@/hooks'

import {
  clearPlayerAction,
  selectPlayerAction,
  selectPlayerActionTimestamp,
  selectPlayerFastForwarding,
  selectPlayerMuted,
  selectPlayerVolume,
} from '../../../player.slice'
import { FastForwarding } from '../FastForwarding'

type TrackerType = { cancel: (() => void) | null }
const Tracker: TrackerType = { cancel: null }

export function Actions() {
  const [dispatch, selector] = useStore()
  const action = selector(selectPlayerAction)
  const timestamp = selector(selectPlayerActionTimestamp)
  const muted = selector(selectPlayerMuted)
  const volume = selector(selectPlayerVolume)
  const fastForwarding = selector(selectPlayerFastForwarding)
  const volumeStr = useMemo(() => `${muted ? 0 : volume}%`, [muted, volume])
  const Icon = useMemo(() => {
    if (!action) return null
    switch (action) {
      case 'play':
        return <PlayIcon />
      case 'pause':
        return <PauseIcon />
      case 'mute':
        return <VolumeMutedIcon />
      case 'volumeUp':
        return <VolumeNormalIcon />
      case 'volumeDown':
        return <VolumeModerateIcon />
    }
  }, [action])
  const display = useMotionValue('none')
  const opacity = useMotionValue(1)
  const scale = useTransform(opacity, [1, 0], [0.75, 1.5])

  useEffect(() => {
    if (Tracker.cancel) {
      Tracker.cancel()
      Tracker.cancel = null
    }
    const onEnd = () => {
      display.set('none')
      opacity.set(1)
      Tracker.cancel = null
    }
    display.set('flex')
    const controls = animate(opacity, 0, {
      ease: 'linear',
      duration: 0.5,
      onComplete: () => {
        onEnd()
        dispatch(clearPlayerAction())
      },
      onStop: onEnd,
    })
    Tracker.cancel = controls.stop.bind(controls)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timestamp])

  return (
    <div
      id='player-actions'
      className={cn(
        'absolute top-0 left-0 bottom-0 right-0',
        'w-full h-full flex items-center justify-center',
        'select-none pointer-events-none overflow-hidden',
      )}
    >
      <FastForwarding />
      {(action === 'mute' || action === 'volumeUp' || action === 'volumeDown') &&
        !fastForwarding && (
          <div
            className={cn(
              'absolute top-[3rem] left-[50%] items-center',
              'justify-center text-white py-2 px-4 text-center',
              'bg-black/50 rounded-md translate-x-[-50%]',
            )}
          >
            {volumeStr}
          </div>
        )}
      <motion.div
        className={cn(
          'absolute top-[50%] left-[50%] w-[75px] h-[75px]',
          'items-center justify-center text-white',
          'bg-black/50 rounded-full [&>svg]:w-[50px] [&>svg]:h-[50px]',
        )}
        style={{
          x: '-50%',
          y: '-50%',
          scale,
          opacity,
          display,
        }}
      >
        {Icon}
      </motion.div>
    </div>
  )
}
