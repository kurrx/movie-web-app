import { configureStore } from '@reduxjs/toolkit'

import { APP_NAME, IS_DEV } from '@/api'

import { deviceReducer } from './device'
import { exploreReducer } from './explore'
import {
  endDragging,
  endHovering,
  playerReducer,
  setPlayerFocused,
  setPlayerInteracted,
  setPlayerLoadedProgress,
  setPlayerProgress,
  setPlayerTooltipHovered,
  startDragging,
  startHovering,
  timelineMove,
} from './player'
import { profileReducer } from './profile'
import { searchReducer } from './search'
import { themeReducer } from './theme'
import { watchReducer } from './watch'

export const store = configureStore({
  reducer: {
    device: deviceReducer,
    explore: exploreReducer,
    player: playerReducer,
    profile: profileReducer,
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
    actionsDenylist: [
      'watch/updateTime',
      'watch/updateTime/pending',
      'watch/updateTime/fulfilled',
      'watch/updateTime/rejected',
      setPlayerProgress.type,
      setPlayerLoadedProgress.type,
      setPlayerInteracted.type,
      setPlayerFocused.type,
      setPlayerTooltipHovered.type,
      startHovering.type,
      startDragging.type,
      timelineMove.type,
      endHovering.type,
      endDragging.type,
    ],
  },
})
