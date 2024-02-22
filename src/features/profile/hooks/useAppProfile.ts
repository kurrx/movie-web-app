import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'

import { firebaseAuth } from '@/api'
import { useAppDispatch } from '@/hooks'

import { setProfileReady, setProfileUser } from '../profile.slice'

const readyId = { id: 0 }

export function useAppProfile() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      dispatch(setProfileUser(user))
    })

    const id = (readyId.id = Date.now())
    firebaseAuth.authStateReady().then(() => {
      if (id !== readyId.id) return
      dispatch(setProfileReady())
    })

    return unsubscribe
  }, [dispatch])
}
