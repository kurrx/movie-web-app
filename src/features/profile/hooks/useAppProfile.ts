import { onAuthStateChanged } from 'firebase/auth'
import { Unsubscribe } from 'firebase/database'
import { useEffect, useRef } from 'react'

import { firebaseAuth, subscribeProfileCounters } from '@/api'
import { useAppDispatch } from '@/hooks'

import { setProfileCounters, setProfileReady, setProfileUser } from '../profile.slice'

const readyId = { id: 0 }

export function useAppProfile() {
  const dispatch = useAppDispatch()
  const unsubscribeCounter = useRef<Unsubscribe | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      dispatch(setProfileUser(user))
      if (unsubscribeCounter.current) {
        unsubscribeCounter.current()
        unsubscribeCounter.current = null
      }
      if (user) {
        unsubscribeCounter.current = subscribeProfileCounters(user.uid, (counters) => {
          dispatch(setProfileCounters(counters))
        })
      }
    })

    const id = (readyId.id = Date.now())
    firebaseAuth.authStateReady().then(() => {
      if (id !== readyId.id) return
      dispatch(setProfileReady())
    })

    return () => {
      unsubscribe()
      if (unsubscribeCounter.current) {
        unsubscribeCounter.current()
        unsubscribeCounter.current = null
      }
    }
  }, [dispatch])
}
