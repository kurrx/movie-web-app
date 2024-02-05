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
        'absolute sm:top-[3rem] top-[1rem] left-[50%] items-center',
        'justify-center text-white sm:py-2 py-1 sm:px-4 px-2 text-center',
        'bg-black/50 rounded-md translate-x-[-50%]',
        'flex sm:text-sm text-xs font-medium rounded-full',
        'pointer-events-none select-none',
      )}
    >
      2x
      <FastForwardIcon className='ml-2 sm:w-3 w-2 sm:h-3 h-2' />
    </div>
  )
}
