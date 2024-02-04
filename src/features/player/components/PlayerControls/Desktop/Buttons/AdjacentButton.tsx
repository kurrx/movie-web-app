import { useCallback, useMemo } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { cn } from '@/api'
import { NextPlayIcon } from '@/assets'
import { WatchPlaylistAdjacents } from '@/types'

import { useProps } from '../../../PlayerProps'
import { Button } from './Button'

export interface AdjacentButtonProps {
  type: keyof WatchPlaylistAdjacents
}

export function AdjacentButton({ type }: AdjacentButtonProps) {
  const { playlistAdjacents, onPlayItem } = useProps()
  const adjacent = useMemo(() => playlistAdjacents[type], [playlistAdjacents, type])
  const hotkey = useMemo(() => `shift+${type[0]}`, [type])
  const tooltip = useMemo(() => {
    if (!adjacent) return type.toUpperCase()
    if (adjacent.type === 'episode') {
      return `Сезон ${adjacent.season} Серия ${adjacent.number}`
    }
    return adjacent.title
  }, [adjacent, type])
  const tooltipHotkey = useMemo(() => hotkey.toUpperCase(), [hotkey])
  const visible = useMemo(() => adjacent !== null, [adjacent])

  const play = useCallback(() => {
    if (!adjacent) return
    onPlayItem(adjacent)
  }, [adjacent, onPlayItem])

  useHotkeys(hotkey, play, [play])

  return (
    <Button
      id={`play-${type}`}
      tooltip={tooltip}
      tooltipHotkey={tooltipHotkey}
      tooltipDisabled={!visible}
      disabled={!visible}
      visible={visible}
      onClick={play}
    >
      <NextPlayIcon className={cn(type === 'prev' && 'rotate-180')} />
    </Button>
  )
}
