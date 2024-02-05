import { cn } from '@/api'
import { FastForwardIcon } from '@/assets'
import { useAppSelector } from '@/hooks'

import { selectPlayerFastForwarding } from '../../player.slice'

export function FastForwarding() {
  const fastForwarding = useAppSelector(selectPlayerFastForwarding)

  if (!fastForwarding) return null

  return (
    <div
      className={cn(
        'absolute top-[3rem] left-[50%] items-center',
        'justify-center text-white py-2 px-4 text-center',
        'bg-black/50 rounded-md translate-x-[-50%]',
        'flex text-sm font-medium rounded-full',
      )}
    >
      2x
      <FastForwardIcon className='ml-2 w-3 h-3' />
    </div>
  )
}
