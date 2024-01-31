import type { SerializedError } from '@reduxjs/toolkit'
import { TypedUseSelectorHook } from 'react-redux'

import type { FetchState } from '@/core'
import type { store } from '@/features'

export type AppStoreDispatch = typeof store.dispatch

export type AppStoreState = ReturnType<typeof store.getState>

export type Dispatch = () => AppStoreDispatch

export type Selector = TypedUseSelectorHook<AppStoreState>

export interface ThunkApiConfig {
  state: AppStoreState
  dispatch: AppStoreDispatch
  rejectValue: SerializedError
}

export interface FetchableState {
  state: FetchState
  error: SerializedError | null
  requestId: string | null
}
