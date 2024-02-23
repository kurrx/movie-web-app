import { SerializedError } from '@reduxjs/toolkit'
import { User } from 'firebase/auth'

import { LastItemState, ProfileCounters } from './firebase.types'
import { FetchableState } from './store.types'

export interface ProfileLastItemState extends FetchableState {
  item: LastItemState | null
}

export interface ProfileStoreState {
  dialog: boolean
  loading: boolean
  error: SerializedError | null
  requestId: string | null
  user: User | null
  counters: ProfileCounters | null
  last: ProfileLastItemState
}
