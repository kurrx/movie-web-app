import { cn } from '@/api'
import { useAppSelector } from '@/hooks'

import { selectPlayerDesktopTopVisible } from '../../../player.slice'
import { useProps } from '../../PlayerProps'

export function TopInfo() {
  const { title } = useProps()
  const visible = useAppSelector(selectPlayerDesktopTopVisible)

  return (
    <div
      id='player-top-info'
      className={cn(
        'absolute left-0 top-0 w-full transition-opacity',
        'flex items-center justify-start',
        'data-[visible="false"]:opacity-0 px-6 pt-4',
        'data-[visible="false"]:pointer-events-none',
      )}
      data-visible={visible}
    >
      <div className='grow min-w-0'>
        <div className='truncate text-white text-lg font-medium select-text'>{title}</div>
      </div>
    </div>
  )
}
