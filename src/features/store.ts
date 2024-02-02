import { configureStore } from '@reduxjs/toolkit'

import { APP_NAME, IS_DEV } from '@/api'

import { deviceReducer } from './device'
import { playerReducer } from './player'
import { searchReducer } from './search'
import { themeReducer } from './theme'
import { updateTime, watchReducer } from './watch'

export const store = configureStore({
  reducer: {
    device: deviceReducer,
    player: playerReducer,
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
    actionsDenylist: [updateTime.type],
  },
})
