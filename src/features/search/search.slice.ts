import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SetStateAction } from 'react'

import { fetchSearch } from '@/api'
import { FetchState } from '@/core'
import { AppStoreState, SearchStoreState, ThunkApiConfig } from '@/types'

const initialState: SearchStoreState = {
  open: false,
  disabled: false,
  queries: [],
}

type SearchReturnType = Awaited<ReturnType<typeof fetchSearch>>
type SearchParamType = string
export const search = createAsyncThunk<SearchReturnType, SearchParamType, ThunkApiConfig>(
  'search/search',
  async (query, { signal }) => await fetchSearch({ query, signal }),
  {
    condition(arg, api) {
      if (!arg) return false
      const queries = api.getState().search.queries
      const findQuery = queries.find((q) => q.query === arg)
      if (!findQuery) return true
      return findQuery.state === FetchState.ERROR
    },
  },
)

const searchSlice = createSlice({
  name: 'search',
  initialState,

  reducers: {
    setSearchOpen(state, action: PayloadAction<SetStateAction<boolean>>) {
      const payload = action.payload
      state.open = typeof payload === 'function' ? payload(state.open) : payload
    },

    setSearchDisabled(state, action: PayloadAction<SetStateAction<boolean>>) {
      const payload = action.payload
      state.disabled = typeof payload === 'function' ? payload(state.open) : payload
    },
  },

  extraReducers(builder) {
    builder
      .addCase(search.pending, (state, action) => {
        const query = state.queries.find((q) => q.query === action.meta.arg)
        if (!query) {
          state.queries.push({
            query: action.meta.arg,
            state: FetchState.LOADING,
            error: null,
            requestId: action.meta.requestId,
            paginated: false,
            results: null,
          })
        } else {
          query.state = FetchState.LOADING
          query.error = null
          query.requestId = action.meta.requestId
          query.results = null
        }
      })
      .addCase(search.fulfilled, (state, action) => {
        const query = state.queries.find((q) => q.requestId === action.meta.requestId)
        if (query && query.state === FetchState.LOADING) {
          query.state = FetchState.SUCCESS
          query.results = action.payload.results
          query.paginated = action.payload.paginated
          query.requestId = null
        }
      })
      .addCase(search.rejected, (state, action) => {
        const query = state.queries.find((q) => q.requestId === action.meta.requestId)
        if (query && query.state === FetchState.LOADING) {
          query.state = FetchState.ERROR
          query.error = action.error
          query.requestId = null
        }
      })
  },
})

export const { setSearchOpen, setSearchDisabled } = searchSlice.actions

export const selectSearchOpen = (state: AppStoreState) => state.search.open
export const selectSearchDisabled = (state: AppStoreState) => state.search.disabled
export const selectSearchResult = (state: AppStoreState, query: string) =>
  state.search.queries.find((q) => q.query === query)

export const searchReducer = searchSlice.reducer
