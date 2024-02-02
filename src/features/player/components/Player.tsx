import { PlayerNodesProvider } from './PlayerNodes'
import { PlayerProps, PlayerPropsProvider } from './PlayerProps'

export function Player(props: PlayerProps) {
  return (
    <PlayerPropsProvider {...props}>
      <PlayerNodesProvider>TEST</PlayerNodesProvider>
    </PlayerPropsProvider>
  )
}
