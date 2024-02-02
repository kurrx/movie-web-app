import { PlayerProps, PlayerPropsProvider } from './PlayerProps'

export function Player(props: PlayerProps) {
  return <PlayerPropsProvider {...props}>TEST</PlayerPropsProvider>
}
