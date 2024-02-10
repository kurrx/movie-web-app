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

interface SizeIDModel {
  qualityId: string
}

interface SizeDataModel {
  size: number
}

export interface MovieSizeModel extends Model, IDModel, SizeIDModel, SizeDataModel {}
export interface MovieSizeKey extends IDModel, SizeIDModel {}

export interface SeriesSizeModel extends MovieSizeModel, SeriesModel {}
export interface SeriesSizeKey extends MovieSizeKey, SeriesModel {}
