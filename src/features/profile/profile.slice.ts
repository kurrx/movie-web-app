import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SetStateAction } from 'react'

import { googleSignIn } from '@/api'
import { LoginState } from '@/core'
import { AppStoreState, ProfileStoreState, ThunkApiConfig } from '@/types'

const initialState: ProfileStoreState = {
  loginDialog: false,
  loginState: {
    state: LoginState.IDLE,
    error: null,
    requestId: null,
  },
  user: null,
}

type SignInReturn = Awaited<ReturnType<typeof googleSignIn>>
export const signIn = createAsyncThunk<SignInReturn, void, ThunkApiConfig>(
  'profile/signIn',
  async () => await googleSignIn(),
  {
    condition(_, api) {
      const state = api.getState().profile.loginState.state
      return state !== LoginState.SUCCESS && state !== LoginState.LOADING
    },
  },
)

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

  extraReducers(builder) {
    builder
      .addCase(signIn.pending, (state, action) => {
        state.loginState.state = LoginState.LOADING
        state.loginState.requestId = action.meta.requestId
        state.loginState.error = null
        state.loginDialog = true
      })
      .addCase(signIn.fulfilled, (state, action) => {
        if (action.meta.requestId === state.loginState.requestId) {
          state.loginState.state = LoginState.SUCCESS
          state.loginState.requestId = null
          state.user = action.payload.user
          state.loginDialog = false
        }
      })
      .addCase(signIn.rejected, (state, action) => {
        if (action.meta.requestId === state.loginState.requestId) {
          state.loginState.state = LoginState.ERROR
          state.loginState.error = action.error
          state.loginDialog = true
        }
      })
  },
})

export const { setProfileLoginDialog } = profileSlice.actions

export const selectProfileIsLoggedIn = (state: AppStoreState) =>
  state.profile.loginState.state === LoginState.SUCCESS && state.profile.user !== null
export const selectProfileLoginDialog = (state: AppStoreState) => state.profile.loginDialog
export const selectProfileUser = (state: AppStoreState) => state.profile.user
export const selectProfileLoginState = (state: AppStoreState) => state.profile.loginState

export const profileReducer = profileSlice.reducer
