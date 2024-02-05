import { useMemo } from 'react'

import { clamp, convertSeconds } from '@/api'
import { useAppSelector } from '@/hooks'

import { selectPlayerDuration, selectPlayerTime } from '../../../player.slice'

export function Timer() {
  const time = useAppSelector(selectPlayerTime)
  const duration = useAppSelector(selectPlayerDuration)
  const text = useMemo(
    () => `${convertSeconds(clamp(time, 0, duration))} / ${convertSeconds(duration)}`,
    [time, duration],
  )

  return (
    <div
      className='h-full px-1.5 text-white text-xs select-text'
      style={{ textShadow: '0 0 2px rgba(0, 0, 0, 0.5)' }}
    >
      {text}
    </div>
  )
}
