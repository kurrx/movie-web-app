import { useCallback } from 'react'

import { useAppDispatch } from '@/hooks'

import { setPlayerInteracted } from '../player.slice'

const timeout: { current: NodeJS.Timeout | null } = { current: null }

export function useInteract() {
  const dispatch = useAppDispatch()

  return useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current)
      timeout.current = null
    }
    dispatch(setPlayerInteracted(true))
    timeout.current = setTimeout(() => {
      dispatch(setPlayerInteracted(false))
      timeout.current = null
    }, 3000)
  }, [dispatch])
}
