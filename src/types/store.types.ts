import type { Action, ThunkAction } from '@reduxjs/toolkit'

import type { store } from '@/features'

export type AppStoreDispatch = typeof store.dispatch

export type AppStoreState = ReturnType<typeof store.getState>

export type AppStoreThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppStoreState,
  unknown,
  Action<string>
>
