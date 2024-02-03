import { PropsWithChildren, useMemo } from 'react'

import { cn } from '@/api'
import { useAppSelector } from '@/hooks'

import { selectPlayerTheater } from '../player.slice'
import { useNodes } from './PlayerNodes'

export function PlayerContainer({ children }: PropsWithChildren) {
  const { setContainer, setContent } = useNodes()
  const fullscreen = false
  const theater = useAppSelector(selectPlayerTheater)
  const classes = useMemo(
    () => cn('container player-container', fullscreen && 'fullscreen', theater && 'theater'),
    [fullscreen, theater],
  )

  return (
    <div ref={setContainer} className={classes}>
      <div ref={setContent} className='player-content'>
        {children}
      </div>
    </div>
  )
}
