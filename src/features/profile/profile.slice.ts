import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SetStateAction } from 'react'

import { AppStoreState, ProfileStoreState } from '@/types'

const initialState: ProfileStoreState = {
  loginDialog: false,
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileLoginDialog(state, action: PayloadAction<SetStateAction<boolean>>) {
      const payload = action.payload
      const next = typeof payload === 'function' ? payload(state.loginDialog) : payload
      state.loginDialog = next
    },
  },
})

export const { setProfileLoginDialog } = profileSlice.actions

export const selectProfileLoginDialog = (state: AppStoreState) => state.profile.loginDialog

export const profileReducer = profileSlice.reducer
