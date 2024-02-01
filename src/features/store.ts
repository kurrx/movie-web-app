import { configureStore } from '@reduxjs/toolkit'

import { APP_NAME, IS_DEV } from '@/api'

import { searchReducer } from './search'
import { themeReducer } from './theme'
import { watchReducer } from './watch'

export const store = configureStore({
  reducer: {
    search: searchReducer,
    theme: themeReducer,
    watch: watchReducer,
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
