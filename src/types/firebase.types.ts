import { QueryDocumentSnapshot } from 'firebase/firestore'

import { ThumbnailSegment } from '@/core'

import { SearchItem } from './ajax.types'

export interface FirestoreModel {
  uid: string
  id: number
}

interface ProfileItemField<T> {
  value: T
  updatedAt: number
}

export type FirestoreProfileItemType = 'favorite' | 'saved' | 'watched' | 'rated'

export interface FirestoreProfileItem extends FirestoreModel {
  title: string
  isSeries: boolean
  url: string
  posterUrl: string
  description: string
  kpRating?: number | null
  favorite: ProfileItemField<boolean>
  saved: ProfileItemField<boolean>
  watched: ProfileItemField<boolean>
  rating: ProfileItemField<number | null | undefined>
}

export interface UpdateProfileItemArgs {
  lastWatched?: number
  favorite?: boolean
  saved?: boolean
  watched?: boolean
  rating?: number | null
}

export interface QueryProfileItemsArgs {
  type: FirestoreProfileItemType
  limitSize?: number
  last?: QueryDocumentSnapshot
}

export interface QueryProfileItemsResult {
  items: SearchItem[]
  next: (() => Promise<QueryProfileItemsResult>) | null
}

export interface ProfileCounters {
  total: number

  favorite: number
  saved: number
  watched: number
  rated: number

  seriesType: number
  moviesType: number

  films: number
  cartoons: number
  series: number
  animation: number
}

export type ProfileCounter = keyof ProfileCounters
export type ProfileTypeCounter = 'films' | 'cartoons' | 'series' | 'animation'

export interface UpdateCounterAction {
  type: 'increment' | 'decrement'
  counter: ProfileCounter
}

export interface FirestoreItemState extends FirestoreModel {
  uid: string
  id: number
  translatorId: number
  quality: string
  subtitle?: string | null
  season?: number | null
  episode?: number | null
  updatedAt: number
}

export interface UpdateItemStateArgs {
  timestamp?: number
  translatorId?: number
  quality?: string
  subtitle?: string | null
  season?: number | null
  episode?: number | null
}

export interface LastItemState {
  id: number
  title: string
  subtitle: string
  url: string
  thumbnails: ThumbnailSegment
  progress: number
  duration: number
}
