import type { SwitchState } from '@/core'

import type { Item } from './ajax.types'
import type { FetchableState } from './store.types'

export interface WatchItemSwitchState extends FetchableState<SwitchState> {
  id: number
}

export interface WatchItemState {
  translatorId: number
  timestamp: number
  quality: string
  subtitle: string | null
  season?: number
  episode?: number
}

export interface WatchProfileItem {
  favorite: boolean
  saved: boolean
  watched: boolean
  rating?: number | null
}

export interface WatchItem extends FetchableState {
  id: number
  item: Item | null
  profile: WatchProfileItem | null
}

export interface WatchStoreState {
  items: WatchItem[]
  states: Record<number, WatchItemState | undefined>
  switchStates: WatchItemSwitchState[]
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
  season: number
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

export type WatchPlaylistPlayItem = WatchPlaylistItemFranchise | WatchPlaylistItemEpisode

export interface WatchPlaylistAdjacents {
  prev: WatchPlaylistPlayItem | null
  next: WatchPlaylistPlayItem | null
}
