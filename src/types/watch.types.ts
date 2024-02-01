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

export interface WatchPlaylistItemFranchise {
  type: 'franchise'
  title: string
  to: string
  year: number | null
  rating: number | null
  isCurrent?: boolean
}

export interface WatchPlaylistItemEpisode {
  type: 'episode'
  number: number
  title: string
  originalTitle: string | null
  releaseDate: string | null
  isCurrent?: boolean
}

export interface WatchPlaylistItemSeason {
  type: 'season'
  number: number
  isCurrent?: boolean
  episodes: WatchPlaylistItemEpisode[]
}

export type WatchPlaylistItem = WatchPlaylistItemFranchise | WatchPlaylistItemSeason

export interface WatchPlaylist {
  title: string
  items: WatchPlaylistItem[]
}
