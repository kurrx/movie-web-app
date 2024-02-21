import { SerializedError } from '@reduxjs/toolkit'
import { User } from 'firebase/auth'

import { SearchItem } from './ajax.types'

export interface ShortProfileItem {
  total: number
  items: SearchItem[]
}

export interface ShortProfileItems {
  favorites: ShortProfileItem
  saves: ShortProfileItem
  watches: ShortProfileItem
  rates: ShortProfileItem
  total: number
}

export interface ProfileStoreState {
  dialog: boolean
  loading: boolean
  error: SerializedError | null
  requestId: string | null
  user: User | null
  short: ShortProfileItems | null
}
