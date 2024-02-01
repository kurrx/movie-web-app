import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { fetchItem } from '@/api'
import { FetchState } from '@/core'
import { AppStoreState, ItemFullID, ThunkApiConfig, WatchStoreState } from '@/types'

const initialState: WatchStoreState = {
  items: [],
}

type GetItemReturnType = Awaited<ReturnType<typeof fetchItem>>
type GetItemParamType = ItemFullID
export const getItem = createAsyncThunk<GetItemReturnType, GetItemParamType, ThunkApiConfig>(
  'watch/getItem',
  async (fullId, { signal }) => await fetchItem({ fullId, signal }),
  {
    condition(arg, api) {
      const items = api.getState().watch.items
      const findItem = items.find((i) => i.id === arg.id)
      if (!findItem) return true
      return findItem.state !== FetchState.SUCCESS
    },
  },
)

const watchSlice = createSlice({
  name: 'watch',
  initialState,

  reducers: {},

  extraReducers(builder) {
    builder
      .addCase(getItem.pending, (state, action) => {
        const item = state.items.find((i) => i.id === action.meta.arg.id)
        if (!item) {
          state.items.push({
            id: action.meta.arg.id,
            state: FetchState.LOADING,
            error: null,
            requestId: action.meta.requestId,
            item: null,
          })
        } else {
          item.state = FetchState.LOADING
          item.error = null
          item.requestId = action.meta.requestId
          item.item = null
        }
      })
      .addCase(getItem.fulfilled, (state, action) => {
        const item = state.items.find((i) => i.id === action.meta.arg.id)
        if (item && item.state === FetchState.LOADING) {
          item.state = FetchState.SUCCESS
          item.item = action.payload
        }
      })
      .addCase(getItem.rejected, (state, action) => {
        const item = state.items.find((q) => q.requestId === action.meta.requestId)
        if (item && item.state === FetchState.LOADING) {
          item.state = FetchState.ERROR
          item.error = action.error
        }
      })
  },
})

export const selectWatchItemOptional = (state: AppStoreState, id: number) =>
  state.watch.items.find((i) => i.id === id)

export const watchReducer = watchSlice.reducer
