import { RequestArgs } from './request.types'
import { NavigationItemCollection } from './router.types'

// Common Types
export interface ItemID {
  typeId: string
  genreId: string
  slug: string
}

export interface ItemFullID extends ItemID {
  id: number
  type: string
  genre: string
}

// Search Types
export interface FetchSearchArgs extends RequestArgs {
  query: string
}

export interface SearchItem extends ItemFullID {
  title: string
  posterUrl: string
  description: string
}

// Item Types
export interface FetchItemArgs extends RequestArgs {
  fullId: ItemFullID
}

export interface ItemRating {
  rate: number
  votes: number
  link: string
}

export interface ItemCollection extends NavigationItemCollection {
  place: number | null
}

export interface ItemPerson {
  id: number
  name: string
  photoUrl: string
  job: string
  url: string
}

export interface ItemFranchiseItem extends ItemFullID {
  order: number
  title: string
  isCurrent: boolean
  year: number | null
  rating: number | null
}

export interface ItemFranchise {
  title: string
  url: string
  items: ItemFranchiseItem[]
}

export interface ItemTranslator {
  id: number
  name: string
  isUkranian: boolean
  rating: number
  isCamrip: boolean
  isAds: boolean
  isDirector: boolean
}

export interface BaseItem extends ItemFullID {
  ogType: 'video.movie' | 'video.tv_series'
  title: string
  favsId: string
  translators: ItemTranslator[]
  franchise: ItemFranchise | null

  originalTitle: string | null
  highResPosterUrl: string | null
  posterUrl: string | null
  lastInfo: string | null
  duration: number | null
  description: string | null
  slogan: string | null
  releaseDate: string | null
  country: string | null
  quality: string | null
  ageRating: string | null
  imdbRating: ItemRating | null
  kinopoiskRating: ItemRating | null
  bestOf: ItemCollection[]
  collections: ItemCollection[]
  directors: ItemPerson[]
  actors: ItemPerson[]
  genreIds: string[]
}

export interface ItemMovie extends BaseItem {
  ogType: 'video.movie'
  type: 'movie'
}

export interface ItemSeries extends BaseItem {
  ogType: 'video.tv_series'
  type: 'series'
}

export type Item = ItemMovie | ItemSeries
