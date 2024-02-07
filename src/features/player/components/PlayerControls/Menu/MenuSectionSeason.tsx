import { ChevronRightIcon } from '@radix-ui/react-icons'
import { useCallback, useMemo } from 'react'

import { cn } from '@/api'
import { WatchPlaylistItemSeason } from '@/types'

import { useMenu } from './MenuProvider'

export interface MenuSectionSeasonProps {
  item: WatchPlaylistItemSeason
}

export function MenuSectionSeason({ item }: MenuSectionSeasonProps) {
  const { setSection } = useMenu()
  const title = useMemo(() => `${item.number} Сезон`, [item])
  const episodesTitle = useMemo(() => {
    const length = item.episodes.length
    return `${length} ${length === 1 ? 'Серия' : 'Серий'}`
  }, [item])

  const onClick = useCallback(() => {
    setSection(title)
  }, [setSection, title])

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
      <span className='flex items-center justify-between flex-1'>
        <span className='font-medium flex flex-col items-start justify-center text-left grow'>
          <span>{title}</span>
          <span className='mt-1 text-muted-foreground'>{episodesTitle}</span>
        </span>
        <span className='flex items-center justify-center space-x-2'>
          <ChevronRightIcon />
        </span>
      </span>
    </button>
  )
}
