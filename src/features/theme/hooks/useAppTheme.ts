import { useEffect } from 'react'
import { useMediaQuery } from 'usehooks-ts'

import { useStore } from '@/hooks'

import { selectTheme, selectThemeType, setThemeIsDarkPrefered } from '../theme.slice'

export function useAppTheme() {
  const [dispatch, selector] = useStore()
  const theme = selector(selectTheme)
  const themeType = selector(selectThemeType)
  const isDarkPrefers = useMediaQuery('(prefers-color-scheme: dark)')

  useEffect(() => {
    dispatch(setThemeIsDarkPrefered(isDarkPrefers))
  }, [dispatch, isDarkPrefers])

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const html = window.document.documentElement
    html.classList.remove('light', 'dark')
    html.classList.add(themeType)
  }, [themeType])
}
