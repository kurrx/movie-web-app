import { SeriesEpisodesStreamSuccessResponse, StreamSuccessResponse } from './ajax.types'

export interface Model {
  pk?: number
}

export interface StreamDetailsModel extends Model {
  id: number
  translatorId: number
  season?: number
  episode?: number
}

export interface StreamThumbnailsModel extends StreamDetailsModel {
  content: string
}

export interface StreamSizeModel extends StreamDetailsModel {
  qualityId: string
  size: number
}

export interface ItemModel {
  id: number
  html: string
  updatedAt: number
}

export interface AjaxMovieModel extends Model {
  id: number
  translatorId: number
  favsId: string
  isCamrip: boolean
  isAds: boolean
  isDirector: boolean
  data: StreamSuccessResponse
  updatedAt: number
}

export interface AjaxSeriesStreamModel extends Model {
  id: number
  translatorId: number
  favsId: string
  season: number
  episode: number
  data: StreamSuccessResponse
  updatedAt: number
}

export interface AjaxSeriesEpisodesStreamModel extends Model {
  id: number
  translatorId: number
  favsId: string
  season?: number
  episode?: number
  data: SeriesEpisodesStreamSuccessResponse
  updatedAt: number
}
