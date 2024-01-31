import { RequestArgs } from './request.types'

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
export interface SearchArgs extends RequestArgs {
  query: string
}

export interface SearchItem extends ItemFullID {
  title: string
  posterUrl: string
  description: string
}
