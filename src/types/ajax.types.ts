import { Thumbnails } from '@/core'

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
  translatorId?: number
  season?: number
  episode?: number
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

export interface ItemMovieStream {
  translatorId: number
  stream: Stream | null
}

export interface ItemMovie extends BaseItem {
  ogType: 'video.movie'
  itemType: 'movie'
  streams: ItemMovieStream[]
}

export interface ItemEpisodeInfo {
  title: string | null
  originalTitle: string | null
  releaseDate: string | null
}

export interface ItemSeriesEpisodeStream {
  number: number
  title: string
  stream: Stream | null
}

export interface ItemSeriesSeasonStream {
  number: number
  title: string
  episodes: ItemSeriesEpisodeStream[]
}

export interface ItemSeriesStream {
  translatorId: number
  seasons: ItemSeriesSeasonStream[] | null
}

export interface ItemSeries extends BaseItem {
  ogType: 'video.tv_series'
  itemType: 'series'
  streams: ItemSeriesStream[]
  episodesInfo: ItemEpisodeInfo[][]
}

export type Item = ItemMovie | ItemSeries

// Stream Types
export interface FetchStreamBaseArgs extends RequestArgs {
  id: number
  translatorId: number
  favsId: string
}

export interface FetchMovieStreamArgs extends FetchStreamBaseArgs {
  isCamrip: boolean
  isAds: boolean
  isDirector: boolean
}

export interface FetchSeriesStreamArgs extends FetchStreamBaseArgs {
  season: number
  episode: number
}

export interface FetchSeriesEpisodesStreamArgs extends FetchStreamBaseArgs {
  season?: number
  episode?: number
}

export interface StreamBaseResponse {
  message: string
}

export interface StreamBaseSuccessResponse extends StreamBaseResponse {
  success: true
}

export interface StreamBaseErrorResponse extends StreamBaseResponse {
  success: false
}

export interface StreamSuccessResponse extends StreamBaseSuccessResponse {
  thumbnails: string
  url: string
  subtitle: false | string
  subtitle_def: false | string
  subtitle_lns: false | Record<string, string>
  quality: string
}

export type StreamResponse = StreamSuccessResponse | StreamBaseErrorResponse

export interface SeriesEpisodesStreamSuccessResponse extends StreamSuccessResponse {
  seasons: string
  episodes: string
}

export type SeriesEpisodesStreamResponse =
  | SeriesEpisodesStreamSuccessResponse
  | StreamBaseErrorResponse

export interface StreamSubtitle {
  id: string | null
  title: string | null
  url: string | null
}

export interface StreamQuality {
  id: string
  altername: string | null
  streamUrl: string
  downloadUrl: string
  downloadSize: number
  downloadSizeStr: string
}

export interface Stream {
  subtitles: StreamSubtitle[]
  defaultSubtitle: string | null
  message: string
  thumbnailsUrl: string
  thumbnails: Thumbnails
  defaultQuality: string
  qualities: StreamQuality[]
}

export interface StreamEpisode {
  number: number
  title: string
}

export interface StreamSeason {
  number: number
  title: string
  episodes: StreamEpisode[]
}
