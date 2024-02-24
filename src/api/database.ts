import Dexie, { Table } from 'dexie'

import {
  FetchMovieStreamArgs,
  FetchSeriesEpisodesStreamArgs,
  FetchSeriesStreamArgs,
  FetchStreamDownloadSizeArgs,
  FetchStreamThumbnailArgs,
  ItemModel,
  Model,
  MovieKey,
  MovieModel,
  MovieSizeKey,
  MovieSizeModel,
  MovieThumbnailsKey,
  MovieThumbnailsModel,
  SeasonsKey,
  SeasonsModel,
  SeriesKey,
  SeriesModel,
  SeriesSizeKey,
  SeriesSizeModel,
  SeriesThumbnailsKey,
  SeriesThumbnailsModel,
  StreamSeason,
  StreamSuccessResponse,
} from '@/types'

class Database extends Dexie {
  private static readonly VERSION = 4.0
  private static readonly NAME = 'tv-db'
  private static readonly MAX_ITEMS = 100
  private static readonly MAX_STREAMS = 5000
  items!: Table<ItemModel, number>
  movies!: Table<MovieModel, MovieKey>
  series!: Table<SeriesModel, SeriesKey>
  seasons!: Table<SeasonsModel, SeasonsKey>
  moviesSizes!: Table<MovieSizeModel, MovieSizeKey>
  seriesSizes!: Table<SeriesSizeModel, SeriesSizeKey>
  moviesThumbnails!: Table<MovieThumbnailsModel, MovieThumbnailsKey>
  seriesThumbnails!: Table<SeriesThumbnailsModel, SeriesThumbnailsKey>

  constructor() {
    super(Database.NAME)
    this.version(Database.VERSION).stores({
      items: 'id, createdAt, updatedAt',
      movies: '[id+translatorId+isCamrip+isAds+isDirector], createdAt, updatedAt',
      series: '[id+translatorId+season+episode], createdAt, updatedAt',
      seasons: '[id+translatorId], createdAt, updatedAt',
      moviesSizes: '[id+translatorId+qualityId], createdAt, updatedAt',
      seriesSizes: '[id+translatorId+qualityId+season+episode], createdAt, updatedAt',
      moviesThumbnails: '[id+translatorId], createdAt, updatedAt',
      seriesThumbnails: '[id+translatorId+season+episode], createdAt, updatedAt',
    })
  }

  private static isExpired(entry: Model) {
    const now = new Date()
    if (now.getUTCFullYear() !== entry.updatedAt.getUTCFullYear()) return true
    if (now.getUTCMonth() !== entry.updatedAt.getUTCMonth()) return true
    if (now.getUTCDate() !== entry.updatedAt.getUTCDate()) return true
    return false
  }

  private async clean<T extends Model, K>(
    table: Table<T, K>,
    checkExpired: boolean,
    maxCount: number,
    getKey: (entry: T) => K,
  ) {
    if (checkExpired) {
      await table.filter((entry) => Database.isExpired(entry)).delete()
    }
    const count = await table.count()
    if (count <= maxCount) return
    const lastItem = await table.orderBy('updatedAt').first()
    if (!lastItem) return
    await table.delete(getKey(lastItem))
  }

  async cleanById(id: number) {
    await this.items.delete(id)
    await this.movies.where({ id }).delete()
    await this.series.where({ id }).delete()
    await this.seasons.where({ id }).delete()
    await this.moviesSizes.where({ id }).delete()
    await this.seriesSizes.where({ id }).delete()
    await this.moviesThumbnails.where({ id }).delete()
    await this.seriesThumbnails.where({ id }).delete()
  }

  async getItem(id: number, fetch: () => Promise<Document>) {
    await this.clean(this.items, false, Database.MAX_ITEMS, (entry) => entry.id)
    const entry = await this.items.get(id)
    if (!entry) {
      const document = await fetch()
      const html = document.documentElement.innerHTML
      const date = new Date()
      if (!entry) {
        this.items.add({ id, html, createdAt: date, updatedAt: date })
      } else {
        this.items.update(id, { html, updatedAt: date })
      }
      return document
    }
    return new DOMParser().parseFromString(entry.html, 'text/html')
  }

  private async getMovieSize(args: FetchStreamDownloadSizeArgs, fetch: () => Promise<number>) {
    const { id, translatorId, qualityId } = args
    const key = { id, translatorId, qualityId }
    await this.clean(this.moviesSizes, false, Database.MAX_STREAMS, (entry) => ({
      id: entry.id,
      translatorId: entry.translatorId,
      qualityId: entry.qualityId,
    }))
    const entry = await this.moviesSizes.get(key)
    if (!entry) {
      const size = await fetch()
      const date = new Date()
      this.moviesSizes.add({
        ...key,
        size,
        createdAt: date,
        updatedAt: date,
      })
      return size
    }
    return entry.size
  }

  private async getSeriesSize(args: FetchStreamDownloadSizeArgs, fetch: () => Promise<number>) {
    const { id, translatorId, qualityId, season, episode } = args
    const key = { id, translatorId, qualityId, season: season!, episode: episode! }
    await this.clean(this.seriesSizes, false, Database.MAX_STREAMS, (entry) => ({
      id: entry.id,
      translatorId: entry.translatorId,
      qualityId: entry.qualityId,
      season: entry.season,
      episode: entry.episode,
    }))
    const entry = await this.seriesSizes.get(key)
    if (!entry) {
      const size = await fetch()
      const date = new Date()
      this.seriesSizes.add({
        ...key,
        size,
        createdAt: date,
        updatedAt: date,
      })
      return size
    }
    return entry.size
  }

  async getSize(args: FetchStreamDownloadSizeArgs, fetch: () => Promise<number>) {
    if (typeof args.season === 'number' && typeof args.episode === 'number') {
      return await this.getSeriesSize(args, fetch)
    }
    return await this.getMovieSize(args, fetch)
  }

  private async getMovieThumbnails(args: FetchStreamThumbnailArgs, fetch: () => Promise<string>) {
    const { id, translatorId } = args
    const key = { id, translatorId }
    const entry = await this.moviesThumbnails.get(key)
    await this.clean(this.moviesThumbnails, true, Database.MAX_STREAMS, (entry) => ({
      id: entry.id,
      translatorId: entry.translatorId,
    }))
    if (!entry || Database.isExpired(entry)) {
      const content = await fetch()
      const date = new Date()
      this.moviesThumbnails.add({
        ...key,
        content,
        createdAt: date,
        updatedAt: date,
      })
      return content
    }
    return entry.content
  }

  private async getSeriesThumbnails(args: FetchStreamThumbnailArgs, fetch: () => Promise<string>) {
    const { id, translatorId, season, episode } = args
    const key = { id, translatorId, season: season!, episode: episode! }
    await this.clean(this.seriesThumbnails, true, Database.MAX_STREAMS, (entry) => ({
      id: entry.id,
      translatorId: entry.translatorId,
      season: entry.season,
      episode: entry.episode,
    }))
    const entry = await this.seriesThumbnails.get(key)
    if (!entry || Database.isExpired(entry)) {
      const content = await fetch()
      const date = new Date()
      this.seriesThumbnails.add({
        ...key,
        content,
        createdAt: date,
        updatedAt: date,
      })
      return content
    }
    return entry.content
  }

  async getThumbnails(args: FetchStreamThumbnailArgs, fetch: () => Promise<string>) {
    if (typeof args.season === 'number' && typeof args.episode === 'number') {
      return await this.getSeriesThumbnails(args, fetch)
    }
    return await this.getMovieThumbnails(args, fetch)
  }

  async getMovie(args: FetchMovieStreamArgs, fetch: () => Promise<StreamSuccessResponse>) {
    const { id, translatorId, favsId, isCamrip, isAds, isDirector } = args
    const key = {
      id,
      translatorId,
      isCamrip: Number(isCamrip) as 0 | 1,
      isAds: Number(isAds) as 0 | 1,
      isDirector: Number(isDirector) as 0 | 1,
    }
    await this.clean(this.movies, true, Database.MAX_STREAMS, (entry) => ({
      id: entry.id,
      translatorId: entry.translatorId,
      isCamrip: entry.isCamrip,
      isAds: entry.isAds,
      isDirector: entry.isDirector,
    }))
    const entry = await this.movies.get(key)
    if (!entry || Database.isExpired(entry) || entry.favsId !== favsId) {
      const data = await fetch()
      const date = new Date()
      if (!entry) {
        this.movies.add({
          ...key,
          favsId,
          data,
          createdAt: date,
          updatedAt: date,
        })
      } else {
        this.movies.update(key, { favsId, data, updatedAt: date })
      }
      return data
    }
    return entry.data
  }

  async getSeries(args: FetchSeriesStreamArgs, fetch: () => Promise<StreamSuccessResponse>) {
    const { id, translatorId, season, episode, favsId } = args
    const key = { id, translatorId, season, episode }
    await this.clean(this.series, true, Database.MAX_STREAMS, (entry) => ({
      id: entry.id,
      translatorId: entry.translatorId,
      season: entry.season,
      episode: entry.episode,
    }))
    const entry = await this.series.get(key)
    if (!entry || Database.isExpired(entry) || entry.favsId !== favsId) {
      const data = await fetch()
      const date = new Date()
      if (!entry) {
        this.series.add({
          ...key,
          favsId,
          data,
          createdAt: date,
          updatedAt: date,
        })
      } else {
        this.series.update(key, { favsId, data, updatedAt: date })
      }
      return data
    }
    return entry.data
  }

  async addSeries(args: FetchSeriesStreamArgs, data: StreamSuccessResponse) {
    const { id, translatorId, season, episode, favsId } = args
    const key = { id, translatorId, season, episode }
    await this.clean(this.series, true, Database.MAX_STREAMS, (entry) => ({
      id: entry.id,
      translatorId: entry.translatorId,
      season: entry.season,
      episode: entry.episode,
    }))
    const entry = await this.series.get(key)
    const date = new Date()
    if (!entry) {
      this.series.add({
        ...key,
        favsId,
        data,
        createdAt: date,
        updatedAt: date,
      })
    } else {
      this.series.update(key, { favsId, data, updatedAt: date })
    }
  }

  async getSeasons(args: FetchSeriesEpisodesStreamArgs, fetch: () => Promise<StreamSeason[]>) {
    const { id, translatorId, favsId } = args
    const key = { id, translatorId }
    await this.clean(this.seasons, true, Database.MAX_STREAMS, (entry) => ({
      id: entry.id,
      translatorId: entry.translatorId,
    }))
    const entry = await this.seasons.get(key)
    if (!entry || Database.isExpired(entry) || entry.favsId !== favsId) {
      const seasons = await fetch()
      const date = new Date()
      if (!entry) {
        this.seasons.add({
          ...key,
          favsId,
          seasons,
          createdAt: date,
          updatedAt: date,
        })
      } else {
        this.seasons.update(key, { favsId, seasons, updatedAt: date })
      }
      return seasons
    }
    return entry.seasons
  }
}

export const db = new Database()
