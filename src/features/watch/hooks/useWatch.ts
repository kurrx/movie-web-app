import { useEffect } from 'react'

import { useAppSelector } from '@/hooks'

import { saveItemStates } from '../watch.schemas'
import { selectWatchItemStates } from '../watch.slice'

export function useWatch() {
  const states = useAppSelector(selectWatchItemStates)

  useEffect(() => {
    saveItemStates(states)
  }, [states])
}
