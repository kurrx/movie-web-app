import './Player.css'

import { PlayerContainer } from './PlayerContainer'
import { PlayerNodesProvider } from './PlayerNodes'
import { PlayerProps, PlayerPropsProvider } from './PlayerProps'

export function Player(props: PlayerProps) {
  return (
    <PlayerPropsProvider {...props}>
      <PlayerNodesProvider>
        <PlayerContainer.Root>
          <PlayerContainer.Wrapper></PlayerContainer.Wrapper>
        </PlayerContainer.Root>
      </PlayerNodesProvider>
    </PlayerPropsProvider>
  )
}
