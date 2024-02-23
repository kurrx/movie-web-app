import { onAuthStateChanged } from 'firebase/auth'
import { Unsubscribe } from 'firebase/database'
import { useEffect, useRef } from 'react'

import { firebaseAuth, subscribeProfileCounters } from '@/api'
import { useStore } from '@/hooks'

import {
  getProfileLast,
  selectProfileUser,
  setProfileCounters,
  setProfileReady,
  setProfileUser,
} from '../profile.slice'

const readyId = { id: 0 }

export function useAppProfile() {
  const [dispatch, selector] = useStore()
  const user = selector(selectProfileUser)
  const unsubscribeCounter = useRef<Unsubscribe | null>(null)

  useEffect(() => {
    if (!user) return
    const signal = dispatch(getProfileLast(user.uid))
    return () => {
      signal.abort()
    }
  }, [dispatch, user])

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
