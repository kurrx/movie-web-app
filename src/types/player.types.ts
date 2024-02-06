export type PlayerMenu = 'settings' | 'playlist' | null
export type PlayerAction = 'play' | 'pause' | 'mute' | 'volumeUp' | 'volumeDown' | null
export type PlayerSeek = 'forward' | 'backward' | null

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
  loadedProgress: number
  isTimelineHovering: boolean
  isTimelineDragging: boolean
  timelineSeekProgress: number
  thumbnailsOverlayProgress: number
  showThumbnailsOverlay: boolean
  seek: PlayerSeek
  accumulatedSeek: number
  displayAccumulatedSeek: number

  interacted: boolean
  focused: boolean
  tooltipHovered: boolean

  fullscreen: boolean
  pip: boolean

  menu: PlayerMenu
  action: PlayerAction
  actionTimestamp: number
  fastForwarding: boolean
}
