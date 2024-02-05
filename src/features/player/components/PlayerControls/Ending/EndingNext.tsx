import { useCallback, useRef, useState } from 'react'
import { useInterval } from 'usehooks-ts'

import { Button } from '@/components'
import { WatchPlaylistPlayItem } from '@/types'

export interface EndingNextProps {
  next: WatchPlaylistPlayItem
  onPlayNext: () => void
  onCancel: () => void
}

export function EndingNext({ next, onPlayNext, onCancel }: EndingNextProps) {
  const secondsRef = useRef(5)
  const [seconds, setSeconds] = useState(5)

  const tick = useCallback(() => {
    const next = secondsRef.current - 1
    secondsRef.current = next
    if (next >= 0) setSeconds(next)
    if (next === 0) onPlayNext()
  }, [onPlayNext])

  useInterval(tick, 1000)

  return (
    <div className='flex flex-col items-start w-[25rem]'>
      <p className='leading-7 text-muted-foreground select-text'>
        Up next in: <span className='text-white font-medium'>{seconds}</span>
      </p>
      <h3 className='text-xl font-semibold tracking-tight text-white mt-2 select-text'>
        {next.title}
      </h3>
      <div className='flex space-x-2 mt-4 w-full'>
        <Button variant='secondary' className='flex-1' onClick={onCancel}>
          Cancel
        </Button>
        <Button className='flex-1' onClick={onPlayNext}>
          Play Now
        </Button>
      </div>
    </div>
  )
}
