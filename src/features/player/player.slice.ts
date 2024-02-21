import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SetStateAction } from 'react'
import ReactPlayer from 'react-player/file'

import { clamp } from '@/api'
import { AppStoreState, PlayerMenu, PlayerSeek, PlayerStoreState } from '@/types'

import { getPlayerSettings } from './player.schemas'

const initialState: PlayerStoreState = {
  initialized: false,
  canAutoStart: false,

  ...getPlayerSettings(),

  ready: false,
  buffering: false,
  playing: false,
  ended: false,
  durationFetched: false,
  duration: 0,
  progress: 0,
  loadedProgress: 0,
  isTimelineHovering: false,
  isTimelineDragging: false,
  timelineSeekProgress: 0,
  thumbnailsOverlayProgress: 0,
  showThumbnailsOverlay: false,
  seek: null,
  accumulatedSeek: 0,
  displayAccumulatedSeek: 0,

  interacted: false,
  focused: false,
  tooltipHovered: false,

  fullscreen: false,
  pip: false,

  menu: null,
  action: null,
  actionTimestamp: 0,
  fastForwarding: false,
}

const playerSlice = createSlice({
  name: 'player',
  initialState,

  reducers: {
    setPlayerInitialized(state, action: PayloadAction<boolean>) {
      state.initialized = action.payload
    },

    enablePlayerCanAutoStart(state) {
      state.canAutoStart = true
    },

    setPlayerTheater(state, action: PayloadAction<SetStateAction<boolean>>) {
      if (state.fullscreen) return
      const payload = action.payload
      const next = typeof payload === 'function' ? payload(state.theater) : payload
      state.theater = next
    },

    setPlayerAutoPlay(state, action: PayloadAction<SetStateAction<boolean>>) {
      const payload = action.payload
      const next = typeof payload === 'function' ? payload(state.autoPlay) : payload
      state.autoPlay = next
    },

    setPlayerVolume(state, action: PayloadAction<SetStateAction<number>>) {
      const payload = action.payload
      const next = typeof payload === 'function' ? payload(state.volume) : payload
      const clampedNext = clamp(next, 0, 100)
      state.volume = clampedNext
      if (clampedNext === 0) {
        state.muted = true
      } else {
        state.muted = false
      }
    },

    setPlayerVolumeWithAction(state, action: PayloadAction<SetStateAction<number>>) {
      const payload = action.payload
      const next = typeof payload === 'function' ? payload(state.volume) : payload
      const clampedNext = clamp(next, 0, 100)
      state.action = clampedNext < state.volume ? 'volumeDown' : 'volumeUp'
      state.volume = clampedNext
      if (clampedNext === 0) {
        state.muted = true
        state.action = 'mute'
      } else {
        state.muted = false
      }
      state.actionTimestamp = Date.now()
    },

    setPlayerMuted(state, action: PayloadAction<SetStateAction<boolean>>) {
      const payload = action.payload
      const next = typeof payload === 'function' ? payload(state.muted) : payload
      state.muted = next
      if (!next && state.volume === 0) {
        state.volume = 100
      }
    },

    setPlayerMutedWithAction(state, action: PayloadAction<SetStateAction<boolean>>) {
      const payload = action.payload
      const next = typeof payload === 'function' ? payload(state.muted) : payload
      state.muted = next
      if (!next && state.volume === 0) {
        state.volume = 100
      }
      state.action = next ? 'mute' : 'volumeUp'
      state.actionTimestamp = Date.now()
    },

    setPlayerPlaybackSpeed(state, action: PayloadAction<SetStateAction<number>>) {
      if (state.fastForwarding) return
      const payload = action.payload
      const next = typeof payload === 'function' ? payload(state.playbackSpeed) : payload
      const clampedNext = clamp(next, 0.25, 2)
      state.playbackSpeed = clampedNext
    },

    setPlayerJumpStep(state, action: PayloadAction<SetStateAction<number>>) {
      const payload = action.payload
      const next = typeof payload === 'function' ? payload(state.jumpStep) : payload
      const clampedNext = clamp(next, 1, 60)
      state.jumpStep = clampedNext
    },

    setPlayerReady(state) {
      state.ready = true
      if (state.canAutoStart) {
        state.playing = true
      }
    },

    setPlayerBuffering(state, action: PayloadAction<SetStateAction<boolean>>) {
      const payload = action.payload
      const next = typeof payload === 'function' ? payload(state.buffering) : payload
      state.buffering = next
    },

    setPlayerPlaying(state, action: PayloadAction<SetStateAction<boolean>>) {
      if (!state.ready) return
      if (!state.durationFetched) return
      if (state.ended) return
      if (state.fastForwarding) return
      if (state.isTimelineDragging) return
      if (state.seek !== null) return
      const payload = action.payload
      const next = typeof payload === 'function' ? payload(state.playing) : payload
      state.playing = next
    },

    setPlayerPlayingWithAction(state, action: PayloadAction<SetStateAction<boolean>>) {
      if (!state.ready) return
      if (!state.durationFetched) return
      if (state.ended) return
      if (state.fastForwarding) return
      if (state.seek !== null) return
      const payload = action.payload
      const next = typeof payload === 'function' ? payload(state.playing) : payload
      state.playing = next
      state.action = next ? 'play' : 'pause'
      state.actionTimestamp = Date.now()
    },

    startReplay(state) {
      state.ended = false
      state.playing = true
    },

    startReplayWithAction(state) {
      state.ended = false
      state.playing = true
      state.action = 'play'
      state.actionTimestamp = Date.now()
    },

    setPlayerEnded(state) {
      state.ended = true
      state.playing = false
      state.pip = false
      state.fastForwarding = false
    },

    setPlayerDuration(state, action: PayloadAction<number>) {
      state.durationFetched = true
      state.duration = action.payload
    },

    setPlayerProgress(state, action: PayloadAction<number>) {
      if (state.showThumbnailsOverlay && state.progress !== state.thumbnailsOverlayProgress) {
        state.showThumbnailsOverlay = false
      }
      state.progress = action.payload
    },

    setPlayerLoadedProgress(state, action: PayloadAction<number>) {
      state.loadedProgress = action.payload
    },

    startHovering(state, action: PayloadAction<number>) {
      if (!state.ready) return
      if (!state.durationFetched) return
      state.isTimelineHovering = true
      state.timelineSeekProgress = action.payload
    },

    startDragging(state, action: PayloadAction<number>) {
      if (!state.ready) return
      if (!state.durationFetched) return
      state.isTimelineDragging = true
      state.timelineSeekProgress = action.payload
    },

    timelineMove(state, action: PayloadAction<number>) {
      if (!state.ready) return
      if (!state.durationFetched) return
      state.timelineSeekProgress = action.payload
    },

    endHovering(state) {
      if (!state.ready) return
      if (!state.durationFetched) return
      state.isTimelineHovering = false
    },

    endDragging(state) {
      if (!state.ready) return
      if (!state.durationFetched) return
      state.isTimelineDragging = false
      state.progress = state.timelineSeekProgress
      state.thumbnailsOverlayProgress = state.timelineSeekProgress
      state.showThumbnailsOverlay = true
      if (state.ended) {
        state.ended = false
        state.playing = true
      }
    },

    seekTo(state, action: PayloadAction<NonNullable<PlayerSeek>>) {
      if (!state.ready) return
      if (!state.durationFetched) return
      const seek = action.payload
      if (state.seek !== seek) {
        state.displayAccumulatedSeek = 0
      }
      const step = state.jumpStep * (seek === 'forward' ? 1 : -1)
      state.accumulatedSeek += step
      state.displayAccumulatedSeek += step
      const time = clamp(state.progress + state.accumulatedSeek, 0, state.duration - 1)
      state.timelineSeekProgress = time
      state.seek = seek
      if (state.ended) {
        state.ended = false
        state.playing = true
      }
    },

    endSeeking(state, action: PayloadAction<ReactPlayer>) {
      if (!state.ready) return
      if (!state.durationFetched) return
      const player = action.payload
      const time = clamp(state.progress + state.accumulatedSeek, 0, state.duration - 1)
      state.seek = null
      state.accumulatedSeek = 0
      state.displayAccumulatedSeek = 0
      state.progress = time
      state.thumbnailsOverlayProgress = time
      player.seekTo(time)
    },

    setPlayerInteracted(state, action: PayloadAction<SetStateAction<boolean>>) {
      const payload = action.payload
      const next = typeof payload === 'function' ? payload(state.interacted) : payload
      state.interacted = next
    },

    setPlayerFocused(state, action: PayloadAction<SetStateAction<boolean>>) {
      const payload = action.payload
      const next = typeof payload === 'function' ? payload(state.focused) : payload
      state.focused = next
    },

    setPlayerTooltipHovered(state, action: PayloadAction<SetStateAction<boolean>>) {
      const payload = action.payload
      const next = typeof payload === 'function' ? payload(state.tooltipHovered) : payload
      state.tooltipHovered = next
    },

    setPlayerFullscreen(state, action: PayloadAction<SetStateAction<boolean>>) {
      const payload = action.payload
      const next = typeof payload === 'function' ? payload(state.fullscreen) : payload
      state.fullscreen = next
      if (next) {
        state.pip = false
      }
    },

    setPlayerPip(state, action: PayloadAction<SetStateAction<boolean>>) {
      if (!state.ready) return
      if (!state.durationFetched) return
      if (state.ended) return
      if (state.fullscreen) return
      const payload = action.payload
      const next = typeof payload === 'function' ? payload(state.pip) : payload
      state.pip = next
    },

    setPlayerMenu(state, action: PayloadAction<PlayerMenu>) {
      state.menu = action.payload
    },

    clearPlayerAction(state) {
      state.action = null
    },

    setPlayerFastForwarding(state, action: PayloadAction<SetStateAction<boolean>>) {
      if (!state.ready) return
      if (!state.durationFetched) return
      if (state.ended) return
      const payload = action.payload
      const next = typeof payload === 'function' ? payload(state.fastForwarding) : payload
      state.fastForwarding = next
    },

    resetPlayerState(state) {
      state.ready = false
      state.buffering = false
      state.playing = false
      state.ended = false
      state.durationFetched = false
      state.duration = 0
      state.progress = 0
      state.loadedProgress = 0
      state.isTimelineHovering = false
      state.isTimelineDragging = false
      state.timelineSeekProgress = 0
      state.showThumbnailsOverlay = false
      state.thumbnailsOverlayProgress = 0
      state.seek = null
      state.accumulatedSeek = 0
      state.displayAccumulatedSeek = 0
      state.interacted = false
      state.focused = false
      state.tooltipHovered = false
      state.menu = null
      state.action = null
      state.fastForwarding = false
    },
  },
})

export const {
  setPlayerInitialized,
  enablePlayerCanAutoStart,
  setPlayerTheater,
  setPlayerAutoPlay,
  setPlayerVolume,
  setPlayerVolumeWithAction,
  setPlayerMuted,
  setPlayerMutedWithAction,
  setPlayerPlaybackSpeed,
  setPlayerJumpStep,
  setPlayerReady,
  setPlayerBuffering,
  setPlayerPlaying,
  setPlayerPlayingWithAction,
  startReplay,
  startReplayWithAction,
  setPlayerEnded,
  setPlayerDuration,
  setPlayerProgress,
  setPlayerLoadedProgress,
  startHovering,
  startDragging,
  timelineMove,
  endHovering,
  endDragging,
  seekTo,
  endSeeking,
  setPlayerInteracted,
  setPlayerFocused,
  setPlayerTooltipHovered,
  setPlayerFullscreen,
  setPlayerPip,
  setPlayerMenu,
  clearPlayerAction,
  setPlayerFastForwarding,
  resetPlayerState,
} = playerSlice.actions

export const selectPlayerInitialized = (state: AppStoreState) => state.player.initialized
export const selectPlayerCanAutoStart = (state: AppStoreState) => state.player.canAutoStart

export const selectPlayerTheater = (state: AppStoreState) => state.player.theater
export const selectPlayerAutoPlay = (state: AppStoreState) => state.player.autoPlay
export const selectPlayerVolume = (state: AppStoreState) => state.player.volume
export const selectPlayerMuted = (state: AppStoreState) => state.player.muted
export const selectPlayerPlaybackSpeed = (state: AppStoreState) => state.player.playbackSpeed
export const selectPlayerJumpStep = (state: AppStoreState) => state.player.jumpStep
export const selectPlayerSettings = createSelector(
  selectPlayerTheater,
  selectPlayerAutoPlay,
  selectPlayerVolume,
  selectPlayerMuted,
  selectPlayerPlaybackSpeed,
  selectPlayerJumpStep,
  (theater, autoPlay, volume, muted, playbackSpeed, jumpStep) => ({
    theater,
    autoPlay,
    volume,
    muted,
    playbackSpeed,
    jumpStep,
  }),
)

export const selectPlayerReady = (state: AppStoreState) => state.player.ready
export const selectPlayerBuffering = (state: AppStoreState) => state.player.buffering
export const selectPlayerPlaying = (state: AppStoreState) => state.player.playing
export const selectPlayerEnded = (state: AppStoreState) => state.player.ended
export const selectPlayerDurationFetched = (state: AppStoreState) => state.player.durationFetched
export const selectPlayerDuration = (state: AppStoreState) => state.player.duration
export const selectPlayerProgress = (state: AppStoreState) => state.player.progress
export const selectPlayerLoadedProgress = (state: AppStoreState) => state.player.loadedProgress
export const selectPlayerIsTimelineHovering = (state: AppStoreState) =>
  state.player.isTimelineHovering
export const selectPlayerIsTimelineDragging = (state: AppStoreState) =>
  state.player.isTimelineDragging
export const selectPlayerTimelineSeekProgress = (state: AppStoreState) =>
  state.player.timelineSeekProgress
export const selectPlayerThumbnailsOverlayProgress = (state: AppStoreState) =>
  state.player.thumbnailsOverlayProgress
export const selectPlayerShowThumbnailsOverlay = (state: AppStoreState) =>
  state.player.showThumbnailsOverlay
export const selectPlayerSeek = (state: AppStoreState) => state.player.seek
export const selectPlayerAccumulatedSeek = (state: AppStoreState) => state.player.accumulatedSeek
export const selectPlayerDisplayAccumulatedSeek = (state: AppStoreState) =>
  state.player.displayAccumulatedSeek

export const selectPlayerInteracted = (state: AppStoreState) => state.player.interacted
export const selectPlayerFocused = (state: AppStoreState) => state.player.focused
export const selectPlayerTooltipHovered = (state: AppStoreState) => state.player.tooltipHovered

export const selectPlayerFullscreen = (state: AppStoreState) => state.player.fullscreen
export const selectPlayerPip = (state: AppStoreState) => state.player.pip

export const selectPlayerMenu = (state: AppStoreState) => state.player.menu
export const selectPlayerAction = (state: AppStoreState) => state.player.action
export const selectPlayerActionTimestamp = (state: AppStoreState) => state.player.actionTimestamp
export const selectPlayerFastForwarding = (state: AppStoreState) => state.player.fastForwarding

export const selectPlayerPlayingCombined = createSelector(
  selectPlayerPlaying,
  selectPlayerFastForwarding,
  selectPlayerIsTimelineDragging,
  selectPlayerSeek,
  (playing, fastForwarding, isTimelineDragging, seek) =>
    (playing || fastForwarding) && !isTimelineDragging && seek === null,
)
export const selectPlayerTime = createSelector(
  selectPlayerProgress,
  selectPlayerIsTimelineDragging,
  selectPlayerTimelineSeekProgress,
  selectPlayerSeek,
  (progress, isTimelineDragging, timelineSeekProgree, seek) =>
    isTimelineDragging || seek !== null ? timelineSeekProgree : progress,
)
export const selectPlayerThumbnailsProgress = createSelector(
  selectPlayerIsTimelineHovering,
  selectPlayerIsTimelineDragging,
  selectPlayerTimelineSeekProgress,
  (isTimelineHovering, isTimelineDragging, timelineSeekProgress) => {
    if (!isTimelineHovering && !isTimelineDragging) return 0
    return timelineSeekProgress
  },
)
export const selectPlayerThumbnailsOverlaySavedProgress = createSelector(
  selectPlayerIsTimelineHovering,
  selectPlayerIsTimelineDragging,
  selectPlayerTimelineSeekProgress,
  selectPlayerThumbnailsOverlayProgress,
  selectPlayerShowThumbnailsOverlay,
  selectPlayerSeek,
  (
    isTimelineHovering,
    isTimelineDragging,
    timelineSeekProgress,
    thumbnailsOverlayProgress,
    showThumbnailsOverlay,
    seek,
  ) => {
    if (showThumbnailsOverlay) return thumbnailsOverlayProgress
    if (!isTimelineHovering && !isTimelineDragging && seek === null) return 0
    return timelineSeekProgress
  },
)
export const selectPlayerHoverProgress = createSelector(
  selectPlayerIsTimelineHovering,
  selectPlayerIsTimelineDragging,
  selectPlayerTimelineSeekProgress,
  (isTimelineHovering, isTimelineDragging, timelineSeekProgress) => {
    if (isTimelineDragging || !isTimelineHovering) return 0
    return timelineSeekProgress
  },
)
export const selectPlayerPlaybackSpeedCombined = createSelector(
  selectPlayerPlaybackSpeed,
  selectPlayerFastForwarding,
  (playbackSpeed, fastForwarding) => (fastForwarding ? 2 : playbackSpeed),
)
export const selectPlayerFetched = createSelector(
  selectPlayerReady,
  selectPlayerDurationFetched,
  (ready, durationFetched) => ready && durationFetched,
)
export const selectPlayerLoading = createSelector(
  selectPlayerFetched,
  selectPlayerBuffering,
  (fetched, buffering) => !fetched || buffering,
)
export const selectPlayerControlsVisible = createSelector(
  selectPlayerFetched,
  selectPlayerEnded,
  selectPlayerTooltipHovered,
  selectPlayerInteracted,
  selectPlayerFocused,
  selectPlayerPlaying,
  selectPlayerMenu,
  selectPlayerFastForwarding,
  selectPlayerIsTimelineHovering,
  selectPlayerIsTimelineDragging,
  selectPlayerSeek,
  (
    fetched,
    ended,
    tooltipHovered,
    interacted,
    focused,
    playing,
    menu,
    fastForwarding,
    isTimelineHovering,
    isTimelineDragging,
    seek,
  ) => {
    if (!fetched) return false
    if (fastForwarding) return false
    return (
      ended ||
      tooltipHovered ||
      interacted ||
      focused ||
      !playing ||
      menu !== null ||
      isTimelineHovering ||
      isTimelineDragging ||
      seek !== null
    )
  },
)
export const selectPlayerMouseVisible = createSelector(
  selectPlayerFetched,
  selectPlayerControlsVisible,
  selectPlayerFastForwarding,
  (fetched, controlsVisible, fastForwarding) => !fetched || fastForwarding || controlsVisible,
)
export const selectPlayerHeadingVisible = createSelector(
  selectPlayerFullscreen,
  selectPlayerControlsVisible,
  (fullscreen, controlsVisible) => fullscreen && controlsVisible,
)

export const playerReducer = playerSlice.reducer
