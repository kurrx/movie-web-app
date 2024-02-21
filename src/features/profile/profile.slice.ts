import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from 'firebase/auth'
import { SetStateAction } from 'react'

import { googleLogin, queryProfileAllItems } from '@/api'
import { AppStoreState, ProfileStoreState, ThunkApiConfig } from '@/types'

const initialState: ProfileStoreState = {
  dialog: false,
  loading: true,
  error: null,
  requestId: null,
  user: null,
  short: null,
}

type LoginReturn = Awaited<ReturnType<typeof googleLogin>>
export const login = createAsyncThunk<LoginReturn, void, ThunkApiConfig>(
  'profile/login',
  async () => await googleLogin(),
  {
    condition(_, api) {
      const state = api.getState().profile
      const loading = state.loading
      const user = state.user
      return !user && !loading
    },
  },
)

type QueryShortReturn = Awaited<ReturnType<typeof queryProfileAllItems>>
export const queryShort = createAsyncThunk<QueryShortReturn, string, ThunkApiConfig>(
  'profile/queryShort',
  async (uid) => await queryProfileAllItems(uid),
  {
    condition(uid, api) {
      return !api.getState().profile.short
    },
  },
)

const profileSlice = createSlice({
  name: 'profile',
  initialState,

  reducers: {
    setProfileDialog(state, action: PayloadAction<SetStateAction<boolean>>) {
      if (state.user) {
        state.dialog = false
        return
      }
      const payload = action.payload
      const next = typeof payload === 'function' ? payload(state.dialog) : payload
      state.dialog = next
    },

    setProfileReady(state) {
      state.loading = false
    },

    setProfileUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload
      if (!state.user) {
        state.short = null
      }
    },
  },

  extraReducers(builder) {
    builder
      .addCase(login.pending, (state, action) => {
        state.dialog = true
        state.loading = true
        state.error = null
        state.requestId = action.meta.requestId
        state.user = null
      })
      .addCase(login.fulfilled, (state, action) => {
        if (action.meta.requestId === state.requestId) {
          state.dialog = false
          state.loading = false
          state.error = null
          state.requestId = null
          state.user = action.payload.user
        }
      })
      .addCase(login.rejected, (state, action) => {
        if (action.meta.requestId === state.requestId) {
          state.dialog = true
          state.loading = false
          state.error = action.error
          state.requestId = null
          state.user = null
        }
      })

    builder.addCase(queryShort.fulfilled, (state, action) => {
      if (state.user?.uid === action.meta.arg) {
        state.short = action.payload
      }
    })
  },
})

export const { setProfileDialog, setProfileReady, setProfileUser } = profileSlice.actions

export const selectProfileIsLoggedIn = (state: AppStoreState) => state.profile.user !== null
export const selectProfileDialog = createSelector(
  selectProfileIsLoggedIn,
  (state: AppStoreState) => state.profile.dialog,
  (isLoggedIn, loginDialog) => loginDialog && !isLoggedIn,
)
export const selectProfileUser = (state: AppStoreState) => state.profile.user
export const selectProfileLoading = (state: AppStoreState) => state.profile.loading
export const selectProfileError = (state: AppStoreState) => state.profile.error
export const selectProfileShort = (state: AppStoreState) => state.profile.short

export const profileReducer = profileSlice.reducer
