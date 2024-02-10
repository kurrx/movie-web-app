import { useEffect } from 'react'

import { db } from '@/api'
import { useAppSelector } from '@/hooks'

import { selectWatchItemStates } from '../watch.slice'

export function useWatch() {
  const states = useAppSelector(selectWatchItemStates)

  useEffect(() => {
    db.updateItemsStates(states)
  }, [states])
}
