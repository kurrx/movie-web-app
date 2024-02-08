import { useMemo } from 'react'

import { clamp, convertSeconds } from '@/api'
import { useAppSelector } from '@/hooks'

import { selectPlayerDuration, selectPlayerTime } from '../../../player.slice'

export function Timer() {
  const time = useAppSelector(selectPlayerTime)
  const duration = useAppSelector(selectPlayerDuration)
  const timeStr = useMemo(() => convertSeconds(clamp(time, 0, duration)), [time, duration])
  const durationStr = useMemo(() => convertSeconds(duration), [duration])

  return (
    <div className='flex items-center justify-center pointer-events-none font-medium text-white text-xs'>
      <div>{timeStr}</div>
      <div className='opacity-70 mx-1'>/</div>
      <div className='opacity-70'>{durationStr}</div>
    </div>
  )
}
