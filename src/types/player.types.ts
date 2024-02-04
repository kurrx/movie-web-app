export interface PlayerStoreState {
  initialized: boolean
  canAutoStart: boolean

  theater: boolean
  autoPlay: boolean
  volume: number
  muted: boolean
  playbackSpeed: number
  jumpStep: number

  ready: boolean
  buffering: boolean
  playing: boolean
  ended: boolean
  durationFetched: boolean
  duration: number
  progress: number
  loaded: number

  interacted: boolean
  focused: boolean
  tooltipHovered: boolean

  fullscreen: boolean
}
