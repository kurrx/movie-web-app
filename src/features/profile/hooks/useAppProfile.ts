import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'

import { firebaseAuth } from '@/api'
import { useAppDispatch } from '@/hooks'

import { clearProfile, setProfileReady, setProfileUser } from '../profile.slice'

export function useAppProfile() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      dispatch(setProfileUser(user))
    })
    firebaseAuth.authStateReady().then(() => {
      dispatch(setProfileReady())
    })

    return () => {
      unsubscribe()
      dispatch(clearProfile())
    }
  }, [dispatch])
}
