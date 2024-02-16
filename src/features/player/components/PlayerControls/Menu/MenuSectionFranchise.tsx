import { useCallback, useEffect, useRef } from 'react'

import { cn } from '@/api'
import { KinopoiskBadge } from '@/components'
import { useElementRect } from '@/hooks'
import { WatchPlaylistItemFranchise } from '@/types'

import { useProps } from '../../PlayerProps'
import { useMenu } from './MenuProvider'

export interface MenuSectionFranchiseProps {
  item: WatchPlaylistItemFranchise
}

export function MenuSectionFranchise({ item }: MenuSectionFranchiseProps) {
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
        'w-full h-16 px-5 hover:bg-white/10',
        'flex items-center justify-between',
        'space-x-2 text-xs dark:data-[active=true]:bg-white/10',
        'data-[active=true]:bg-black/10',
      )}
      data-active={item.isCurrent}
      onClick={onClick}
    >
      <span
        className='flex items-center justify-between flex-1'
        title={`${item.title}${typeof item.year === 'number' ? ` (${item.year})` : ''}`}
      >
        <span
          ref={titleRef}
          className='font-medium flex flex-col items-start justify-center text-left grow'
        >
          <span className='truncate max-w-[calc(var(--title-width)-20px)] grow min-w-0 flex-1'>
            {item.title}
          </span>
          {typeof item.year === 'number' && (
            <span className='mt-1 text-muted-foreground'>{item.year}</span>
          )}
        </span>
        <KinopoiskBadge rating={item.rating} />
      </span>
    </button>
  )
}
