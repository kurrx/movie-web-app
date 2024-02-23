import { cn } from '@/api'
import { Skeleton } from '@/components'
import { useAppSelector } from '@/hooks'

import { selectPlayerTheater } from '../player.slice'

export function PlayerLoader() {
  const theater = useAppSelector(selectPlayerTheater)

  return (
    <div className={cn('container player-container', theater && 'theater')}>
      <div className='player-content !bg-background'>
        <Skeleton className='absolute left-0 top-0 w-full h-full !rounded-none' />
        <div className='player-wrapper'>
          <div className='player' />
        </div>
      </div>
    </div>
  )
}
