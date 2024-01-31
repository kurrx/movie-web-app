import { configureStore } from '@reduxjs/toolkit'

import { APP_NAME, IS_DEV } from '@/api'

import { searchReducer } from './search'
import { themeReducer } from './theme'

export const store = configureStore({
  reducer: {
    search: searchReducer,
    theme: themeReducer,
  },

  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({
      serializableCheck: false,
    })
  },

  devTools: IS_DEV && {
    name: APP_NAME,
    actionsDenylist: [],
  },
})
