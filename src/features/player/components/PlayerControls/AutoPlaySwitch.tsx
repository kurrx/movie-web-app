import { Root, Thumb } from '@radix-ui/react-switch'
import { useCallback, useMemo } from 'react'

import { cn } from '@/api'
import { PauseIcon, PlayIcon } from '@/assets'
import { useStore } from '@/hooks'

import { selectPlayerAutoPlay, setPlayerAutoPlay } from '../../player.slice'
import { useProps } from '../PlayerProps'
import { PlayerTooltip } from './PlayerTooltip'

export function AutoPlaySwitch() {
  const [dispatch, selector] = useStore()
  const { playlistAdjacents } = useProps()
  const autoPlay = selector(selectPlayerAutoPlay)
  const tooltip = useMemo(() => (autoPlay ? 'Autoplay is on' : 'Autoplay is off'), [autoPlay])
  const Icon = useMemo(() => (autoPlay ? PlayIcon : PauseIcon), [autoPlay])
  const visible = useMemo(() => !!playlistAdjacents.next, [playlistAdjacents.next])

  const setAutoPlay = useCallback(
    (autoPlay: boolean) => {
      dispatch(setPlayerAutoPlay(autoPlay))
    },
    [dispatch],
  )

  return (
    <PlayerTooltip content={tooltip}>
      <div className='px-2 flex items-center justify-center h-12'>
        <Root
          className={cn(
            'peer inline-flex shrink-0 cursor-pointer',
            'items-center rounded-full border-2 border-transparent',
            'shadow-sm transition-colors',
            'disabled:cursor-not-allowed',
            'disabled:opacity-50 h-5 w-9',
            'data-[state=checked]:bg-white',
            'data-[state=unchecked]:bg-white/30',
            'focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-ring',
            'light border-2 border-black/15',
            'data-[visible=false]:hidden',
          )}
          checked={autoPlay}
          data-visible={visible}
          onCheckedChange={setAutoPlay}
        >
          <Thumb
            className={cn(
              'pointer-events-none flex rounded-full',
              'bg-black shadow-lg ring-0 justify-center',
              'transition-transform items-center h-4 w-4',
              'data-[state=checked]:translate-x-4',
              'data-[state=unchecked]:translate-x-0',
            )}
          >
            <Icon className='w-4 h-4 text-white' />
          </Thumb>
        </Root>
      </div>
    </PlayerTooltip>
  )
}
