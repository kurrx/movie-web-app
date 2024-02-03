import './Player.css'

import { useEffect } from 'react'

import { useAppDispatch } from '@/hooks'

import { setPlayerInitialized } from '../player.slice'
import { PlayerContainer } from './PlayerContainer'
import { PlayerNative } from './PlayerNative'
import { PlayerNodesProvider } from './PlayerNodes'
import { PlayerProps, PlayerPropsProvider } from './PlayerProps'

export function Player(props: PlayerProps) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setPlayerInitialized(true))
    return () => {
      dispatch(setPlayerInitialized(false))
    }
  }, [dispatch])

  return (
    <PlayerPropsProvider {...props}>
      <PlayerNodesProvider>
        <PlayerContainer>
          <PlayerNative />
        </PlayerContainer>
      </PlayerNodesProvider>
    </PlayerPropsProvider>
  )
}
