import './Player.css'

import { Fragment, useEffect } from 'react'

import { SwitchState } from '@/core'
import { useAppDispatch } from '@/hooks'

import { usePlayerFullscreen } from '../hooks'
import { setPlayerInitialized } from '../player.slice'
import { PlayerContainer } from './PlayerContainer'
import { PlayerControls } from './PlayerControls'
import { PlayerNative } from './PlayerNative'
import { PlayerNodesProvider } from './PlayerNodes'
import { PlayerProps, PlayerPropsProvider } from './PlayerProps'
import { PlayerSwitchState } from './PlayerSwitchState'
import { PlayerThumbnailsOverlay } from './PlayerThumbnailsOverlay'

export function Player(props: PlayerProps) {
  const { mediaUrl, switchState } = props
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setPlayerInitialized(true))
    return () => {
      dispatch(setPlayerInitialized(false))
    }
  }, [dispatch])

  usePlayerFullscreen()

  return (
    <PlayerPropsProvider {...props}>
      <PlayerNodesProvider>
        <PlayerContainer>
          {switchState.state === SwitchState.IDLE && (
            <Fragment>
              <PlayerNative key={mediaUrl} />
              <PlayerThumbnailsOverlay />
              {/* TODO: Thumbnails Overlay */}
              <PlayerControls />
            </Fragment>
          )}
          <PlayerSwitchState />
        </PlayerContainer>
      </PlayerNodesProvider>
    </PlayerPropsProvider>
  )
}
