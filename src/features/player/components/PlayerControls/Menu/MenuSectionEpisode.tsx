import { useCallback, useEffect, useRef } from 'react'

import { cn } from '@/api'
import { useElementRect } from '@/hooks'
import { WatchPlaylistItemEpisode } from '@/types'

import { useProps } from '../../PlayerProps'
import { useMenu } from './MenuProvider'

export interface MenuSectionEpisodeProps {
  item: WatchPlaylistItemEpisode
}

export function MenuSectionEpisode({ item }: MenuSectionEpisodeProps) {
  const { onPlayItem } = useProps()
  const { setOpen } = useMenu()
  const titleRef = useRef<HTMLSpanElement>(null)
  const { width } = useElementRect(titleRef)

  const onClick = useCallback(() => {
    onPlayItem(item)
    setOpen(false)
  }, [onPlayItem, setOpen, item])

  useEffect(() => {
    if (!titleRef.current) return
    titleRef.current.style.setProperty('--title-width', `${width}px`)
  }, [width])

  return (
    <button
      className={cn(
        'w-full h-16 pl-5 pr-2 hover:bg-white/10',
        'flex items-center justify-between',
        'space-x-2 text-xs [&_svg]:w-5 [&_svg]:h-5',
        'dark:data-[active=true]:bg-white/10',
        'data-[active=true]:bg-black/10',
      )}
      data-active={item.isCurrent}
      onClick={onClick}
    >
      <span
        ref={titleRef}
        className='font-medium flex flex-col items-start justify-center text-left grow'
        title={item.title}
      >
        <span className='truncate max-w-[calc(var(--title-width)-20px)] grow min-w-0 flex-1'>
          {item.title}
        </span>
        {item.releaseDate && <span className='mt-1 text-muted-foreground'>{item.releaseDate}</span>}
      </span>
    </button>
  )
}
