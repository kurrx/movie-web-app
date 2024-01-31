import type { Action, SerializedError, ThunkAction } from '@reduxjs/toolkit'

import type { FetchState } from '@/core'
import type { store } from '@/features'

export type AppStoreDispatch = typeof store.dispatch

export type AppStoreState = ReturnType<typeof store.getState>

export type AppStoreThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppStoreState,
  unknown,
  Action<string>
>

export interface FetchableState {
  state: FetchState
  error: SerializedError | null
  requestId: string | null
}
