import { useCallback, useMemo } from 'react'

import { cn } from '@/api'
import { NextPlayIcon } from '@/assets'
import { WatchPlaylistAdjacents } from '@/types'

import { useProps } from '../../PlayerProps'

export interface AdjacentButtonProps {
  type: keyof WatchPlaylistAdjacents
}

export function AdjacentButton({ type }: AdjacentButtonProps) {
  const { playlistAdjacents, onPlayItem } = useProps()
  const adjacent = useMemo(() => playlistAdjacents[type], [playlistAdjacents, type])
  const disabled = useMemo(() => adjacent === null, [adjacent])

  const onClick = useCallback(() => {
    if (!adjacent) return
    onPlayItem(adjacent)
  }, [adjacent, onPlayItem])

  return (
    <button
      className={cn(
        'text-white w-[2.5rem] h-[2.5rem]',
        'flex items-center justify-center disabled:text-white/40',
        'transition-colors active:bg-white/20',
        'rounded-full bg-black/40 disabled:pointer-events-none',
      )}
      disabled={disabled}
      onClick={onClick}
    >
      <NextPlayIcon className={cn('w-[2.5rem] h-[2.5rem]', type === 'prev' && 'rotate-180')} />
    </button>
  )
}
