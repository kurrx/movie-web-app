import { User } from 'firebase/auth'

import { LoginState } from '@/core'

import { FetchableState } from './store.types'

export interface ProfileStoreState {
  loginDialog: boolean
  loginState: FetchableState<LoginState>
  user: User | null
}
