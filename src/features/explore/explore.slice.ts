import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
  SerializedError,
} from '@reduxjs/toolkit'
import { SetStateAction } from 'react'

import { fetchCollections, fetchExplore, fetchPerson } from '@/api'
import { FetchState } from '@/core'
import {
  AppStoreState,
  ExploreCollection,
  ExplorePerson,
  ExploreResponse,
  ExploreStoreState,
  ThunkApiConfig,
} from '@/types'

type Explore = 'queries' | 'persons' | 'collections'
type ThunkConditionApi = { getState: () => AppStoreState }

type PendingPayload = PayloadAction<undefined, string, { arg: string; requestId: string }>
function explorePending(explore: Explore) {
  return function (state: ExploreStoreState, action: PendingPayload) {
    const find = state[explore].find((q) => q.id === action.meta.arg)
    if (!find) {
      state[explore].push({
        id: action.meta.arg,
        response: null,
        state: FetchState.LOADING,
        error: null,
        requestId: action.meta.requestId,
      })
    } else {
      find.state = FetchState.LOADING
      find.error = null
      find.requestId = action.meta.requestId
      find.response = null
    }
  }
}

type Fulfilled = ExploreResponse | ExplorePerson | ExploreCollection
type FulfilledPayload = PayloadAction<Fulfilled, string, { arg: string; requestId: string }>
function exploreFulfilled(explore: Explore) {
  return function (state: ExploreStoreState, action: FulfilledPayload) {
    const find = state[explore].find((i) => i.requestId === action.meta.requestId)
    if (find && find.state === FetchState.LOADING) {
      find.state = FetchState.SUCCESS
      find.response = action.payload
      find.requestId = null
    }
  }
}

type Error = SerializedError | undefined
type RejectedPayload = PayloadAction<Error, string, { arg: string; requestId: string }>
function exploreRejected(explore: Explore) {
  return function (state: ExploreStoreState, action: RejectedPayload) {
    const find = state[explore].find((i) => i.requestId === action.meta.requestId)
    if (find && find.state === FetchState.LOADING) {
      find.state = FetchState.ERROR
      find.error = action.payload || null
      find.requestId = null
    }
  }
}

function getExploreOptions(explore: Explore) {
  return {
    condition(arg: string, { getState }: ThunkConditionApi) {
      if (!arg) return false
      const items = getState().explore[explore]
      const find = items.find((q) => q.id === arg)
      if (!find) return true
      return find.state !== FetchState.SUCCESS
    },
  }
}

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
  getExploreOptions('queries'),
)

type PersonReturnType = Awaited<ReturnType<typeof fetchPerson>>
type PersonParamType = string
export const explorePerson = createAsyncThunk<PersonReturnType, PersonParamType, ThunkApiConfig>(
  'explore/person',
  async (id, { signal }) => await fetchPerson({ id, signal }),
  getExploreOptions('persons'),
)

type CReturnType = Awaited<ReturnType<typeof fetchCollections>>
type CParamType = string
export const exploreCollections = createAsyncThunk<CReturnType, CParamType, ThunkApiConfig>(
  'explore/collections',
  async (url, { signal }) => await fetchCollections({ url, signal }),
  getExploreOptions('collections'),
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
      .addCase(exploreSearch.pending, explorePending('queries'))
      .addCase(exploreSearch.fulfilled, exploreFulfilled('queries'))
      .addCase(exploreSearch.rejected, exploreRejected('queries'))

    builder
      .addCase(explorePerson.pending, explorePending('persons'))
      .addCase(explorePerson.fulfilled, exploreFulfilled('persons'))
      .addCase(explorePerson.rejected, exploreRejected('persons'))

    builder
      .addCase(exploreCollections.pending, explorePending('collections'))
      .addCase(exploreCollections.fulfilled, exploreFulfilled('collections'))
      .addCase(exploreCollections.rejected, exploreRejected('collections'))
  },
})

export const { setExploreOpen } = exploreSlice.actions

export const selectExploreOpen = (state: AppStoreState) => state.explore.open
export const selectExploreResult = (state: AppStoreState, url: string) =>
  state.explore.queries.find((q) => q.id === url)
export const selectExploreResponse = createSelector(selectExploreResult, (item) => item!.response!)
export const selectExplorePersonResult = (state: AppStoreState, id: string) =>
  state.explore.persons.find((p) => p.id === id)
export const selectExplorePerson = createSelector(
  selectExplorePersonResult,
  (item) => item!.response!,
)
export const selectExploreCollectionsResult = (state: AppStoreState, url: string) =>
  state.explore.collections.find((c) => c.id === url)
export const selectExploreCollections = createSelector(
  selectExploreCollectionsResult,
  (item) => item!.response!,
)

export const exploreReducer = exploreSlice.reducer
