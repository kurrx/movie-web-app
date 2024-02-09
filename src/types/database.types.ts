import { StreamSuccessResponse } from './ajax.types'

export interface StreamThumbnailsModel {
  id: string
  content: string
}

export interface StreamSizeModel {
  id: string
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
