import { PropsWithChildren, useMemo } from 'react'

import { cn } from '@/api'
import { useAppSelector } from '@/hooks'

import { usePlayerFullscreen } from '../hooks'
import { selectPlayerFullscreen, selectPlayerTheater } from '../player.slice'
import { useNodes } from './PlayerNodes'

export function PlayerContainer({ children }: PropsWithChildren) {
  const { setContainer, setContent } = useNodes()
  const fullscreen = useAppSelector(selectPlayerFullscreen)
  const theater = useAppSelector(selectPlayerTheater)
  const classes = useMemo(
    () => cn('container player-container', fullscreen && 'fullscreen', theater && 'theater'),
    [fullscreen, theater],
  )

  usePlayerFullscreen()

  return (
    <div ref={setContainer} className={classes}>
      <div ref={setContent} className='player-content'>
        {children}
      </div>
    </div>
  )
}
