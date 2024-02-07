import { animate, motion, useMotionValue } from 'framer-motion'
import { useEffect, useMemo } from 'react'

import { cn } from '@/api'
import { SeekBackwardIcon, SeekForwardIcon } from '@/assets'
import { selectDeviceIsMobile } from '@/features/device'
import { useAppSelector } from '@/hooks'

import { selectPlayerDisplayAccumulatedSeek, selectPlayerSeek } from '../../player.slice'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transition: any = { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
type TrackerType = { cancel: (() => void) | null }
const Tracker: TrackerType = { cancel: null }

export function SeekProgress() {
  const isMobile = useAppSelector(selectDeviceIsMobile)
  const seek = useAppSelector(selectPlayerSeek)
  const displayProgress = useAppSelector(selectPlayerDisplayAccumulatedSeek)
  const Icon = useMemo(() => (seek === 'forward' ? SeekForwardIcon : SeekBackwardIcon), [seek])

  const containerDisplay = useMotionValue('none')
  const containerLeft = useMotionValue('auto')
  const containerRight = useMotionValue('auto')
  const iconRotate = useMotionValue('0deg')
  const textX = useMotionValue('0')
  const textLeft = useMotionValue('auto')
  const textRight = useMotionValue('auto')
  const textOpacity = useMotionValue(0)

  useEffect(() => {
    if (Tracker.cancel) {
      Tracker.cancel()
      Tracker.cancel = null
    }
    const onStop = () => {
      containerDisplay.set('none')
      containerLeft.set('auto')
      containerRight.set('auto')
      iconRotate.set('0deg')
      textX.set('0')
      textLeft.set('auto')
      textRight.set('auto')
      textOpacity.set(0)
    }
    containerDisplay.set('block')
    if (seek === null) {
      onStop()
    } else {
      if (seek === 'backward') {
        containerLeft.set(!isMobile ? '30%' : '20%')
        textRight.set('100%')
        iconRotate.set('90deg')
      } else {
        containerRight.set(!isMobile ? '30%' : '20%')
        textLeft.set('100%')
        iconRotate.set('-90deg')
      }
      const nextX = seek === 'backward' ? '-2em' : '2em'
      const rotateControls = animate(iconRotate, '0deg', transition)
      const textXControls = animate(textX, nextX, transition)
      const textOpacityControls = animate(textOpacity, 1, transition)
      Tracker.cancel = () => {
        onStop()
        rotateControls.stop()
        textXControls.stop()
        textOpacityControls.stop()
      }
    }
    return onStop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seek, displayProgress])

  return (
    <motion.div
      id='seek-progress'
      className={cn(
        'absolute top-[50%] translate-y-[-50%]',
        'text-white pointer-events-none select-none',
        'sm:text-[1rem] text-[0.75rem]',
      )}
      style={{
        display: containerDisplay,
        left: containerLeft,
        right: containerRight,
      }}
    >
      <motion.div style={{ rotate: iconRotate }}>
        <Icon className='sm:w-10 sm:h-10 w-7 h-7' />
      </motion.div>
      <motion.span
        className='absolute top-[50%]'
        style={{
          y: '-50%',
          x: textX,
          left: textLeft,
          right: textRight,
          opacity: textOpacity,
        }}
      >
        {displayProgress > 0 ? `+${displayProgress}s` : `${displayProgress}s`}
      </motion.span>
    </motion.div>
  )
}
