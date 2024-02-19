import { StreamSeason, StreamSuccessResponse } from './ajax.types'

export interface Model {
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

type FavsModel = { favsId: string }
type ItemDataModel = { data: StreamSuccessResponse }

interface MovieIDModel {
  isCamrip: 0 | 1
  isAds: 0 | 1
  isDirector: 0 | 1
}
interface SeriesIDModel {
  season: number
  episode: number
}
export type MovieModel = Model & IDModel & FavsModel & ItemDataModel & MovieIDModel
export type MovieKey = IDModel & MovieIDModel
export type SeriesModel = Model & IDModel & FavsModel & ItemDataModel & SeriesIDModel
export type SeriesKey = IDModel & SeriesIDModel

type SizeIDModel = { qualityId: string }
type SizeDataModel = { size: number }
export type MovieSizeModel = Model & IDModel & SizeIDModel & SizeDataModel
export type MovieSizeKey = IDModel & SizeIDModel
export type SeriesSizeModel = MovieSizeModel & SeriesIDModel
export type SeriesSizeKey = MovieSizeKey & SeriesIDModel

type ThumbnailsDataModel = { content: string }
export type MovieThumbnailsModel = Model & IDModel & ThumbnailsDataModel
export type MovieThumbnailsKey = IDModel
export type SeriesThumbnailsModel = MovieThumbnailsModel & SeriesIDModel
export type SeriesThumbnailsKey = MovieThumbnailsKey & SeriesIDModel

type SeasonsDataModel = { seasons: StreamSeason[] }
export type SeasonsModel = Model & IDModel & FavsModel & SeasonsDataModel
export type SeasonsKey = IDModel
