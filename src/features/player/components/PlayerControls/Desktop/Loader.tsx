import { cn } from '@/api'
import { LoaderIcon } from '@/assets'
import { useAppSelector } from '@/hooks'

import { selectPlayerLoading } from '../../../player.slice'

export function Loader() {
  const loading = useAppSelector(selectPlayerLoading)

  return (
    <div
      id='player-loader'
      className={cn(
        'player-abs player-full player-flex text-white',
        'pointer-events-none data-[visible=false]:hidden',
      )}
      data-visible={loading}
    >
      <LoaderIcon className='w-[75px] h-[75px]' />
    </div>
  )
}
