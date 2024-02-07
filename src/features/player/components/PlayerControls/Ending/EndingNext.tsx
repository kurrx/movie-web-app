import { useCallback, useRef, useState } from 'react'
import { useInterval } from 'usehooks-ts'

import { Button } from '@/components'
import { selectDeviceIsMobile } from '@/features/device'
import { useAppSelector } from '@/hooks'
import { WatchPlaylistPlayItem } from '@/types'

export interface EndingNextProps {
  next: WatchPlaylistPlayItem
  onPlayNext: () => void
  onCancel: () => void
}

export function EndingNext({ next, onPlayNext, onCancel }: EndingNextProps) {
  const isMobile = useAppSelector(selectDeviceIsMobile)
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
    <div className='flex flex-col items-start sm:w-[25rem] sm:px-0 w-[100%] px-[2rem] sm:text-[1rem] text-[0.85rem]'>
      <p className='leading-7 text-muted-foreground select-text'>
        Up next in: <span className='text-white font-medium'>{seconds}</span>
      </p>
      <h3 className='sm:text-xl text-lg font-semibold tracking-tight text-white sm:mt-2 mt-1 select-text'>
        {next.title}
      </h3>
      <div className='flex space-x-2 sm:mt-4 mt-3 w-full'>
        <Button
          variant='secondary'
          className='flex-1'
          size={isMobile ? 'sm' : 'default'}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button className='flex-1' size={isMobile ? 'sm' : 'default'} onClick={onPlayNext}>
          Play Now
        </Button>
      </div>
    </div>
  )
}
