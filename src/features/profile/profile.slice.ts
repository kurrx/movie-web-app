import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from 'firebase/auth'
import { SetStateAction } from 'react'

import { getLastItem, googleLogin, saveLastItem } from '@/api'
import { FetchState } from '@/core'
import {
  AppStoreState,
  LastItemState,
  ProfileCounters,
  ProfileStoreState,
  ThunkApiConfig,
} from '@/types'

import { updateTime } from '../watch'

const initialState: ProfileStoreState = {
  dialog: false,
  loading: true,
  error: null,
  requestId: null,
  user: null,
  counters: null,
  last: {
    item: null,
    state: FetchState.LOADING,
    error: null,
    requestId: null,
  },
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

type GetLastReturn = LastItemState | null
export const getProfileLast = createAsyncThunk<GetLastReturn, string, ThunkApiConfig>(
  'profile/getLast',
  async (uid) => await getLastItem(uid),
  {
    condition(arg, api) {
      const profile = api.getState().profile
      if (!profile.user) return
      if (profile.user.uid !== arg) return
      return profile.last.state !== FetchState.SUCCESS
    },
  },
)

export const clearProfileLast = createAsyncThunk<void, string, ThunkApiConfig>(
  'profile/clearLast',
  async (uid) => await saveLastItem(uid, null),
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
        state.counters = null
        state.last = {
          item: null,
          state: FetchState.LOADING,
          error: null,
          requestId: null,
        }
      }
    },

    setProfileCounters(state, action: PayloadAction<ProfileCounters | null>) {
      state.counters = action.payload
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

    builder
      .addCase(getProfileLast.pending, (state, action) => {
        state.last.state = FetchState.LOADING
        state.last.requestId = action.meta.requestId
        state.last.error = null
        state.last.item = null
      })
      .addCase(getProfileLast.fulfilled, (state, action) => {
        if (!state.user) return
        if (state.user.uid !== action.meta.arg) return
        if (state.last.requestId === action.meta.requestId) {
          state.last.state = FetchState.SUCCESS
          state.last.requestId = null
          state.last.error = null
          state.last.item = action.payload
        }
      })
      .addCase(getProfileLast.rejected, (state, action) => {
        if (!state.user) return
        if (state.user.uid !== action.meta.arg) return
        if (state.last.requestId === action.meta.requestId) {
          state.last.state = FetchState.ERROR
          state.last.requestId = null
          state.last.error = action.error
          state.last.item = null
        }
      })

    builder
      .addCase(updateTime.fulfilled, (state, action) => {
        if (!state.user) return
        if (state.user.uid !== action.payload.uid) return
        state.last.item = action.payload.result
      })
      .addCase(clearProfileLast.fulfilled, (state, action) => {
        if (!state.user) return
        if (state.user.uid !== action.meta.arg) return
        state.last.item = null
      })
  },
})

export const { setProfileDialog, setProfileReady, setProfileUser, setProfileCounters } =
  profileSlice.actions

export const selectProfileIsLoggedIn = (state: AppStoreState) => state.profile.user !== null
export const selectProfileDialog = createSelector(
  selectProfileIsLoggedIn,
  (state: AppStoreState) => state.profile.dialog,
  (isLoggedIn, loginDialog) => loginDialog && !isLoggedIn,
)
export const selectProfileUser = (state: AppStoreState) => state.profile.user
export const selectProfileLoading = (state: AppStoreState) => state.profile.loading
export const selectProfileError = (state: AppStoreState) => state.profile.error
export const selectProfileCounters = (state: AppStoreState) => state.profile.counters
export const selectProfileLastItem = (state: AppStoreState) => state.profile.last.item

export const profileReducer = profileSlice.reducer
