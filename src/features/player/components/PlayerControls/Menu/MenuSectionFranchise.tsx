import { useCallback, useMemo } from 'react'

import { cn } from '@/api'
import { WatchPlaylistItemFranchise } from '@/types'

import { useProps } from '../../PlayerProps'
import { useMenu } from './MenuProvider'

function Badge({ rating }: { rating: number | null }) {
  const fixed = useMemo(() => rating?.toFixed(1), [rating])
  const color = useMemo(() => {
    if (!fixed) return null
    const fixedFloat = parseFloat(fixed)
    if (fixedFloat >= 8.2) return 'gold'
    if (fixedFloat > 7) return '#3BB33B'
    if (fixedFloat > 5) return '#777777'
    return '#FF0200'
  }, [fixed])

  if (!fixed || !color) return null

  if (color === 'gold')
    return (
      <span
        className={cn(
          'text-black h-[1.1rem] w-[2.5rem]',
          'flex items-center justify-center shrink-0',
          'font-bold text-[0.6rem] rounded-md space-x-0.5',
        )}
        style={{ backgroundImage: 'linear-gradient(160deg,#eacc7f 16%,#ad9c72 64%)' }}
      >
        <span
          style={{
            backgroundImage: 'url("/images/leaf-left.png")',
            backgroundPosition: 'center center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            width: '0.5em',
            height: '1em',
          }}
        />
        <span>{fixed}</span>
        <span
          style={{
            backgroundImage: 'url("/images/leaf-right.png")',
            backgroundPosition: 'center center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            width: '0.5em',
            height: '1em',
          }}
        />
      </span>
    )

  return (
    <span
      className={cn(
        'text-white h-[1.1rem] w-[2.5rem]',
        'flex items-center justify-center shrink-0',
        'font-bold text-[0.6rem] rounded-md',
      )}
      style={{ backgroundColor: color }}
    >
      {fixed}
    </span>
  )
}

export interface MenuSectionFranchiseProps {
  item: WatchPlaylistItemFranchise
}

export function MenuSectionFranchise({ item }: MenuSectionFranchiseProps) {
  const { onPlayItem } = useProps()
  const { setOpen } = useMenu()

  const onClick = useCallback(() => {
    onPlayItem(item)
    setOpen(false)
  }, [onPlayItem, setOpen, item])

  return (
    <button
      className={cn(
        'w-full h-16 px-5 hover:bg-white/10',
        'flex items-center justify-between',
        'space-x-2 text-xs data-[active=true]:bg-white/10',
      )}
      data-active={item.isCurrent}
      onClick={onClick}
    >
      <span
        className='flex items-center justify-between flex-1'
        title={`${item.title}${typeof item.year === 'number' ? ` (${item.year})` : ''}`}
      >
        <span className='font-medium flex flex-col items-start justify-center text-left grow'>
          <span className='truncate max-w-[12rem] grow min-w-0 flex-1'>{item.title}</span>
          {typeof item.year === 'number' && (
            <span className='mt-1 text-muted-foreground'>{item.year}</span>
          )}
        </span>
        <Badge rating={item.rating} />
      </span>
    </button>
  )
}
