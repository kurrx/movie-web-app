import { StreamSuccessResponse } from './ajax.types'

export interface StreamDetailsModel {
  id: number
  translatorId: number
  season?: number
  episode?: number
}

export interface StreamThumbnailsModel extends StreamDetailsModel {
  content: string
}

export interface StreamSizeModel extends StreamDetailsModel {
  size: number
}

export interface ItemModel {
  id: number
  html: string
  updatedAt: number
}

export interface AjaxMovieModel {
  id: number
  translatorId: number
  favsId: string
  isCamrip: number
  isAds: number
  isDirector: number
  data: StreamSuccessResponse
  updatedAt: number
}
