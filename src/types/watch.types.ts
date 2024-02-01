import { Item } from './ajax.types'
import { FetchableState } from './store.types'

export interface WatchItem extends FetchableState {
  id: number
  item: Item | null
}

export interface WatchStoreState {
  items: WatchItem[]
}
