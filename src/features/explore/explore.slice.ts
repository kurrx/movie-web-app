import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SetStateAction } from 'react'

import { fetchCollections, fetchExplore, fetchPerson } from '@/api'
import { FetchState } from '@/core'
import { AppStoreState, ExploreStoreState, ThunkApiConfig } from '@/types'

const initialState: ExploreStoreState = {
  open: false,
  queries: [],
  persons: [],
  collections: [],
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

type CReturnType = Awaited<ReturnType<typeof fetchCollections>>
type CParamType = string
export const exploreCollections = createAsyncThunk<CReturnType, CParamType, ThunkApiConfig>(
  'explore/collections',
  async (url, { signal }) => await fetchCollections({ url, signal }),
  {
    condition(arg, api) {
      if (!arg) return false
      const collections = api.getState().explore.collections
      const findCollections = collections.find((c) => c.url === arg)
      if (!findCollections) return true
      return findCollections.state !== FetchState.SUCCESS
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

    builder
      .addCase(exploreCollections.pending, (state, action) => {
        const collections = state.collections.find((q) => q.url === action.meta.arg)
        if (!collections) {
          state.collections.push({
            url: action.meta.arg,
            state: FetchState.LOADING,
            error: null,
            requestId: action.meta.requestId,
            collections: null,
          })
        } else {
          collections.state = FetchState.LOADING
          collections.error = null
          collections.requestId = action.meta.requestId
          collections.collections = null
        }
      })
      .addCase(exploreCollections.fulfilled, (state, action) => {
        const collections = state.collections.find((q) => q.requestId === action.meta.requestId)
        if (collections && collections.state === FetchState.LOADING) {
          collections.state = FetchState.SUCCESS
          collections.collections = action.payload
          collections.requestId = null
        }
      })
      .addCase(exploreCollections.rejected, (state, action) => {
        const collections = state.collections.find((q) => q.requestId === action.meta.requestId)
        if (collections && collections.state === FetchState.LOADING) {
          collections.state = FetchState.ERROR
          collections.error = action.error
          collections.requestId = null
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
export const selectExploreCollectionsResult = (state: AppStoreState, url: string) =>
  state.explore.collections.find((c) => c.url === url)
export const selectExploreCollections = createSelector(
  selectExploreCollectionsResult,
  (item) => item!.collections!,
)

export const exploreReducer = exploreSlice.reducer
