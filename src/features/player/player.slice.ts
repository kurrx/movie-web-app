import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { AppStoreState, PlayerStoreState } from '@/types'

const initialState: PlayerStoreState = {
  initialized: false,
  canAutoStart: false,
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
  },
})

export const { setPlayerInitialized, enablePlayerCanAutoStart } = playerSlice.actions

export const selectPlayerInitialized = (state: AppStoreState) => state.player.initialized
export const selectPlayerCanAutoStart = (state: AppStoreState) => state.player.canAutoStart

export const playerReducer = playerSlice.reducer
