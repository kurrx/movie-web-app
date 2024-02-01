import { Item } from './ajax.types'
import { FetchableState } from './store.types'

export interface WatchItemState {
  translatorId: number
  timestamp: number
  quality: string
  subtitle: string | null
  season?: number
  episode?: number
}

export interface WatchItem extends FetchableState {
  id: number
  item: Item | null
}

export interface WatchStoreState {
  items: WatchItem[]
  states: Record<number, WatchItemState | undefined>
}
