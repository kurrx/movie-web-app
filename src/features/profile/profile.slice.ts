import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from 'firebase/auth'
import { SetStateAction } from 'react'

import { googleSignIn } from '@/api'
import { LoginState } from '@/core'
import { AppStoreState, ProfileStoreState, ThunkApiConfig } from '@/types'

const initialState: ProfileStoreState = {
  loginDialog: false,
  loginState: {
    state: LoginState.LOADING,
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

    setProfileReady(state) {
      if (state.loginState.state === LoginState.LOADING) {
        state.loginState.state = LoginState.IDLE
      }
    },

    setProfileUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload
      if (action.payload) {
        state.loginState.state = LoginState.SUCCESS
      } else {
        state.loginState.state = LoginState.IDLE
      }
    },

    clearProfile(state) {
      state.loginDialog = false
      state.loginState.state = LoginState.IDLE
      state.loginState.error = null
      state.loginState.requestId = null
      state.user = null
    },
  },

  extraReducers(builder) {
    builder
      .addCase(signIn.pending, (state, action) => {
        state.loginState.state = LoginState.LOADING
        state.loginState.requestId = action.meta.requestId
        state.loginState.error = null
      })
      .addCase(signIn.fulfilled, (state, action) => {
        if (action.meta.requestId === state.loginState.requestId) {
          state.loginState.state = LoginState.SUCCESS
          state.loginState.requestId = null
          state.loginState.error = null
          state.user = action.payload.user
        }
      })
      .addCase(signIn.rejected, (state, action) => {
        if (action.meta.requestId === state.loginState.requestId) {
          state.loginState.state = LoginState.ERROR
          state.loginState.requestId = null
          state.loginState.error = action.error
        }
      })
  },
})

export const { setProfileLoginDialog, setProfileReady, setProfileUser, clearProfile } =
  profileSlice.actions

export const selectProfileIsLoggedIn = (state: AppStoreState) =>
  state.profile.loginState.state === LoginState.SUCCESS && state.profile.user !== null
export const selectProfileLoginDialog = createSelector(
  selectProfileIsLoggedIn,
  (state: AppStoreState) => state.profile.loginDialog,
  (isLoggedIn, loginDialog) => loginDialog && !isLoggedIn,
)
export const selectProfileUser = (state: AppStoreState) => state.profile.user
export const selectProfileLoginState = (state: AppStoreState) => state.profile.loginState

export const profileReducer = profileSlice.reducer
