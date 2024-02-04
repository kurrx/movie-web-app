import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SetStateAction } from 'react'

import { clamp } from '@/api'
import { AppStoreState, PlayerStoreState } from '@/types'

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
  loaded: 0,
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
      }
    },

    setPlayerMuted(state, action: PayloadAction<SetStateAction<boolean>>) {
      const payload = action.payload
      const next = typeof payload === 'function' ? payload(state.muted) : payload
      state.muted = next
      if (!next && state.volume === 0) {
        state.volume = 100
      }
    },

    setPlayerPlaybackSpeed(state, action: PayloadAction<SetStateAction<number>>) {
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
      const payload = action.payload
      const next = typeof payload === 'function' ? payload(state.playing) : payload
      state.playing = next
    },

    setPlayerEnded(state) {
      state.ended = true
      state.playing = false
    },

    setPlayerDuration(state, action: PayloadAction<number>) {
      state.durationFetched = true
      state.duration = action.payload
    },

    setPlayerProgress(state, action: PayloadAction<number>) {
      state.progress = action.payload
    },

    setPlayerLoaded(state, action: PayloadAction<number>) {
      state.loaded = action.payload
    },

    resetPlayerState(state) {
      state.ready = false
      state.buffering = false
      state.playing = false
      state.ended = false
      state.durationFetched = false
      state.duration = 0
      state.progress = 0
      state.loaded = 0
    },
  },
})

export const {
  setPlayerInitialized,
  enablePlayerCanAutoStart,
  setPlayerTheater,
  setPlayerAutoPlay,
  setPlayerVolume,
  setPlayerMuted,
  setPlayerPlaybackSpeed,
  setPlayerJumpStep,
  setPlayerReady,
  setPlayerBuffering,
  setPlayerPlaying,
  setPlayerEnded,
  setPlayerDuration,
  setPlayerProgress,
  setPlayerLoaded,
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

export const selectPlayerLoading = (state: AppStoreState) => {
  if (!state.player.ready) return true
  if (!state.player.durationFetched) return true
  return state.player.buffering
}
export const selectPlayerFullscreen = (state: AppStoreState) => false
export const selectPlayerDesktopControlsVisible = (state: AppStoreState) => {
  if (!state.player.ready) return false
  if (!state.player.durationFetched) return false
  if (state.player.ended) return true
  if (!state.player.playing) return true
  return false
}
export const selectPlayerDesktopHeadingVisible = createSelector(
  selectPlayerFullscreen,
  selectPlayerDesktopControlsVisible,
  (fullscreen, controlsVisible) => fullscreen && controlsVisible,
)

export const playerReducer = playerSlice.reducer
