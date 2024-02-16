import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SetStateAction } from 'react'

import { fetchExplore, fetchPerson } from '@/api'
import { FetchState } from '@/core'
import { AppStoreState, ExploreStoreState, ThunkApiConfig } from '@/types'

const initialState: ExploreStoreState = {
  open: false,
  queries: [],
  persons: [],
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

type PersonReturnType = Awaited<ReturnType<typeof fetchPerson>>
type PersonParamType = string
export const explorePerson = createAsyncThunk<PersonReturnType, PersonParamType, ThunkApiConfig>(
  'explore/person',
  async (id, { signal }) => await fetchPerson({ id, signal }),
  {
    condition(arg, api) {
      if (!arg) return false
      const persons = api.getState().explore.persons
      const findPerson = persons.find((p) => p.id === arg)
      if (!findPerson) return true
      return findPerson.state !== FetchState.SUCCESS
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
          query.requestId = null
        }
      })
      .addCase(exploreSearch.rejected, (state, action) => {
        const query = state.queries.find((q) => q.requestId === action.meta.requestId)
        if (query && query.state === FetchState.LOADING) {
          query.state = FetchState.ERROR
          query.error = action.error
          query.requestId = null
        }
      })

    builder
      .addCase(explorePerson.pending, (state, action) => {
        const person = state.persons.find((q) => q.id === action.meta.arg)
        if (!person) {
          state.persons.push({
            id: action.meta.arg,
            state: FetchState.LOADING,
            error: null,
            requestId: action.meta.requestId,
            person: null,
          })
        } else {
          person.state = FetchState.LOADING
          person.error = null
          person.requestId = action.meta.requestId
          person.person = null
        }
      })
      .addCase(explorePerson.fulfilled, (state, action) => {
        const person = state.persons.find((q) => q.requestId === action.meta.requestId)
        if (person && person.state === FetchState.LOADING) {
          person.state = FetchState.SUCCESS
          person.person = action.payload
          person.requestId = null
        }
      })
      .addCase(explorePerson.rejected, (state, action) => {
        const person = state.persons.find((q) => q.requestId === action.meta.requestId)
        if (person && person.state === FetchState.LOADING) {
          person.state = FetchState.ERROR
          person.error = action.error
          person.requestId = null
        }
      })
  },
})

export const { setExploreOpen } = exploreSlice.actions

export const selectExploreOpen = (state: AppStoreState) => state.explore.open
export const selectExploreResult = (state: AppStoreState, url: string) =>
  state.explore.queries.find((q) => q.url === url)
export const selectExploreResponse = createSelector(selectExploreResult, (item) => item!.response!)
export const selectExplorePersonResult = (state: AppStoreState, id: string) =>
  state.explore.persons.find((p) => p.id === id)
export const selectExplorePerson = createSelector(
  selectExplorePersonResult,
  (item) => item!.person!,
)

export const exploreReducer = exploreSlice.reducer
