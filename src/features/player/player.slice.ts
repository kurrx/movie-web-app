import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SetStateAction } from 'react'

import { clamp } from '@/api'
import { AppStoreState, PlayerStoreState } from '@/types'

import { getPlayerSettings } from './player.schemas'

const initialState: PlayerStoreState = {
  initialized: false,
  canAutoStart: false,

  ...getPlayerSettings(),
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
      state.theater = typeof payload === 'function' ? payload(state.theater) : payload
    },

    setPlayerAutoPlay(state, action: PayloadAction<SetStateAction<boolean>>) {
      const payload = action.payload
      state.autoPlay = typeof payload === 'function' ? payload(state.autoPlay) : payload
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
      state.playbackSpeed = typeof payload === 'function' ? payload(state.playbackSpeed) : payload
    },

    setPlayerJumpStep(state, action: PayloadAction<SetStateAction<number>>) {
      const payload = action.payload
      state.jumpStep = typeof payload === 'function' ? payload(state.jumpStep) : payload
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

export const selectPlayerLoading = (state: AppStoreState) => false
export const selectPlayerFullscreen = (state: AppStoreState) => false
export const selectPlayerDesktopControlsVisible = (state: AppStoreState) => true
export const selectPlayerDesktopHeadingVisible = createSelector(
  selectPlayerFullscreen,
  selectPlayerDesktopControlsVisible,
  (fullscreen, controlsVisible) => fullscreen && controlsVisible,
)

export const playerReducer = playerSlice.reducer
