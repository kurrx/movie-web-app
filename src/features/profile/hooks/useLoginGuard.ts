import { useCallback } from 'react'

import { useStore } from '@/hooks'

import { selectProfileIsLoggedIn, setProfileDialog } from '../profile.slice'

export function useLoginGuard(cb: () => void | Promise<void>) {
  const [dispatch, selector] = useStore()
  const isLoggedIn = selector(selectProfileIsLoggedIn)

  return useCallback(() => {
    if (!isLoggedIn) {
      dispatch(setProfileDialog(true))
    } else {
      return cb()
    }
  }, [dispatch, cb, isLoggedIn])
}
