export interface PlayerStoreState {
  initialized: boolean
  canAutoStart: boolean

  theater: boolean
  autoPlay: boolean
  volume: number
  muted: boolean
  playbackSpeed: number
  jumpStep: number
}
