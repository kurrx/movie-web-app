import { useCallback } from 'react'

import { cn } from '@/api'
import { WatchPlaylistItemEpisode } from '@/types'

import { useProps } from '../../PlayerProps'
import { useMenu } from './MenuProvider'

export interface MenuSectionEpisodeProps {
  item: WatchPlaylistItemEpisode
}

export function MenuSectionEpisode({ item }: MenuSectionEpisodeProps) {
  const { onPlayItem } = useProps()
  const { setOpen } = useMenu()

  const onClick = useCallback(() => {
    onPlayItem(item)
    setOpen(false)
  }, [onPlayItem, setOpen, item])

  return (
    <button
      className={cn(
        'w-full h-16 pl-5 pr-2 hover:bg-white/10',
        'flex items-center justify-between',
        'space-x-2 text-xs [&_svg]:w-5 [&_svg]:h-5',
        'data-[active=true]:bg-white/10',
      )}
      data-active={item.isCurrent}
      onClick={onClick}
    >
      <span
        className='font-medium flex flex-col items-start justify-center text-left grow'
        title={item.title}
      >
        <span className='truncate max-w-[14rem] grow min-w-0 flex-1'>{item.title}</span>
        {item.releaseDate && <span className='mt-1 text-muted-foreground'>{item.releaseDate}</span>}
      </span>
    </button>
  )
}
