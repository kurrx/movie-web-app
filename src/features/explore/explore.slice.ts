import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SetStateAction } from 'react'

import { fetchExplore } from '@/api'
import { FetchState } from '@/core'
import { AppStoreState, ExploreStoreState, ThunkApiConfig } from '@/types'

const initialState: ExploreStoreState = {
  open: false,
  queries: [],
}

type ExploreReturnType = Awaited<ReturnType<typeof fetchExplore>>
type ExploreParamType = string
export const exploreSearch = createAsyncThunk<ExploreReturnType, ExploreParamType, ThunkApiConfig>(
  'explore/search',
  async (url, { signal }) => await fetchExplore({ url, signal }),
  {
    condition(arg, api) {
      if (!arg) return false
      const queries = api.getState().explore.queries
      const findQuery = queries.find((q) => q.url === arg)
      if (!findQuery) return true
      return findQuery.state !== FetchState.SUCCESS
    },
  },
)

const exploreSlice = createSlice({
  name: 'explore',
  initialState,

  reducers: {
    setExploreOpen(state, action: PayloadAction<SetStateAction<boolean>>) {
      const payload = action.payload
      state.open = typeof payload === 'function' ? payload(state.open) : payload
    },
  },

  extraReducers(builder) {
    builder
      .addCase(exploreSearch.pending, (state, action) => {
        const query = state.queries.find((q) => q.url === action.meta.arg)
        if (!query) {
          state.queries.push({
            url: action.meta.arg,
            state: FetchState.LOADING,
            error: null,
            requestId: action.meta.requestId,
            response: null,
          })
        } else {
          query.state = FetchState.LOADING
          query.error = null
          query.requestId = action.meta.requestId
          query.response = null
        }
      })
      .addCase(exploreSearch.fulfilled, (state, action) => {
        const query = state.queries.find((q) => q.requestId === action.meta.requestId)
        if (query && query.state === FetchState.LOADING) {
          query.state = FetchState.SUCCESS
          query.response = action.payload
        }
      })
      .addCase(exploreSearch.rejected, (state, action) => {
        const query = state.queries.find((q) => q.requestId === action.meta.requestId)
        if (query && query.state === FetchState.LOADING) {
          query.state = FetchState.ERROR
          query.error = action.error
        }
      })
  },
})

export const { setExploreOpen } = exploreSlice.actions

export const selectExploreOpen = (state: AppStoreState) => state.explore.open
export const selectExploreResult = (state: AppStoreState, url: string) =>
  state.explore.queries.find((q) => q.url === url)
export const selectExploreResponse = createSelector(selectExploreResult, (item) => item!.response!)

export const exploreReducer = exploreSlice.reducer
