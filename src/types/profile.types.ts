import { SerializedError } from '@reduxjs/toolkit'
import { User } from 'firebase/auth'

import { ProfileCounters } from './firebase.types'

export interface ProfileStoreState {
  dialog: boolean
  loading: boolean
  error: SerializedError | null
  requestId: string | null
  user: User | null
  counters: ProfileCounters | null
}
