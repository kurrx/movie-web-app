import { useCallback } from 'react'

import { useStore } from '@/hooks'
import { Theme } from '@/types'

import { selectTheme, setTheme as setStoreTheme } from '../theme.slice'

export function useTheme() {
  const [dispatch, selector] = useStore()
  const theme = selector(selectTheme)

  const setTheme = useCallback(
    (theme: Theme) => {
      dispatch(setStoreTheme(theme))
    },
    [dispatch],
  )

  return [theme, setTheme] as const
}
