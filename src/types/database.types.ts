import { StreamSuccessResponse } from './ajax.types'

interface Model {
  createdAt: Date
  updatedAt: Date
}

export interface ItemModel extends Model {
  id: number
  html: string
}

interface IDModel {
  id: number
  translatorId: number
}

interface SeriesModel {
  season: number
  episode: number
}

type SizeIDModel = { qualityId: string }
type SizeDataModel = { size: number }
export type MovieSizeModel = Model & IDModel & SizeIDModel & SizeDataModel
export type MovieSizeKey = IDModel & SizeIDModel
export type SeriesSizeModel = MovieSizeModel & SeriesModel
export type SeriesSizeKey = MovieSizeKey & SeriesModel

type ThumbnailsDataModel = { content: string }
export type MovieThumbnailsModel = Model & IDModel & ThumbnailsDataModel
export type MovieThumbnailsKey = IDModel
export type SeriesThumbnailsModel = MovieThumbnailsModel & SeriesModel
export type SeriesThumbnailsKey = MovieThumbnailsKey & SeriesModel

type FavsModel = { favsId: string }

interface MovieIDModel {
  isCamrip: 0 | 1
  isAds: 0 | 1
  isDirector: 0 | 1
}
type MovieDataModel = { data: StreamSuccessResponse }
export type MovieModel = Model & IDModel & FavsModel & MovieIDModel & MovieDataModel
export type MovieKey = IDModel & MovieIDModel
