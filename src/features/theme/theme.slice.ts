import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { mediaQuery } from '@/api'
import { AppStoreState, Theme, ThemeStoreState, ThemeType } from '@/types'

import { ThemeSchema } from './theme.schemas'

const initialState: ThemeStoreState = {
  theme: ThemeSchema.parse(localStorage.getItem('theme')),
  isDarkPrefered: mediaQuery('(prefers-color-scheme: dark)'),
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,

  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload
    },

    setThemeIsDarkPrefered(state, action: PayloadAction<boolean>) {
      state.isDarkPrefered = action.payload
    },
  },
})

export const { setTheme, setThemeIsDarkPrefered } = themeSlice.actions

export const selectTheme = (state: AppStoreState) => state.theme.theme
export const selectThemeType = (state: AppStoreState): ThemeType => {
  if (state.theme.theme === 'system') {
    return state.theme.isDarkPrefered ? 'dark' : 'light'
  }
  return state.theme.theme
}

export const themeReducer = themeSlice.reducer
