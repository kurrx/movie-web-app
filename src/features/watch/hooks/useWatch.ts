import { useEffect } from 'react'

import { db } from '@/api'
import { useAppSelector } from '@/hooks'

import { selectWatchItemStates } from '../watch.slice'

export function useWatch() {
  const states = useAppSelector(selectWatchItemStates)

  useEffect(() => {
    if (Object.keys(states).length === 0) return
    db.updateItemsStates(states)
  }, [states])
}
