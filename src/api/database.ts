import Dexie, { Table } from 'dexie'

import {
  FetchMovieStreamArgs,
  FetchSeriesEpisodesStreamArgs,
  FetchSeriesStreamArgs,
  FetchStreamDownloadSizeArgs,
  FetchStreamThumbnailArgs,
  ItemModel,
  ItemStateModel,
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
  WatchItemState,
} from '@/types'

class Database extends Dexie {
  items!: Table<ItemModel, number>
  itemsStates!: Table<ItemStateModel, number>
  movies!: Table<MovieModel, MovieKey>
  series!: Table<SeriesModel, SeriesKey>
  seasons!: Table<SeasonsModel, SeasonsKey>
  moviesSizes!: Table<MovieSizeModel, MovieSizeKey>
  seriesSizes!: Table<SeriesSizeModel, SeriesSizeKey>
  moviesThumbnails!: Table<MovieThumbnailsModel, MovieThumbnailsKey>
  seriesThumbnails!: Table<SeriesThumbnailsModel, SeriesThumbnailsKey>

  constructor() {
    super('tv-db')
    this.version(1).stores({
      items: 'id',
      itemsStates: 'id',
      movies: '[id+translatorId+isCamrip+isAds+isDirector]',
      series: '[id+translatorId+season+episode]',
      seasons: '[id+translatorId]',
      moviesSizes: '[id+translatorId+qualityId]',
      seriesSizes: '[id+translatorId+qualityId+season+episode]',
      moviesThumbnails: '[id+translatorId]',
      seriesThumbnails: '[id+translatorId+season+episode]',
    })
  }

  private static isExpired(entry: { updatedAt: Date }) {
    const now = new Date()
    if (now.getUTCFullYear() !== entry.updatedAt.getUTCFullYear()) return true
    if (now.getUTCMonth() !== entry.updatedAt.getUTCMonth()) return true
    if (now.getUTCDate() !== entry.updatedAt.getUTCDate()) return true
    return false
  }

  async getItem(id: number, fetch: () => Promise<Document>) {
    const entry = await this.items.get(id)
    if (!entry || Database.isExpired(entry)) {
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

  async getItemState(id: number) {
    const entry = await this.itemsStates.get(id)
    return entry?.state
  }

  async updateItemsStates(states: Record<number, WatchItemState | undefined>) {
    const date = new Date()
    for (const idStr of Object.keys(states)) {
      const id = parseInt(idStr)
      const state = states[id]
      if (state) {
        const entry = await this.itemsStates.get(id)
        if (!entry) {
          this.itemsStates.add({ id, state, createdAt: date, updatedAt: date })
        } else {
          this.itemsStates.update(id, { state, updatedAt: date })
        }
      }
    }
  }

  private async getMovieSize(args: FetchStreamDownloadSizeArgs, fetch: () => Promise<number>) {
    const { id, translatorId, qualityId } = args
    const key = { id, translatorId, qualityId }
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
    if (!entry) {
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
    const entry = await this.seriesThumbnails.get(key)
    if (!entry) {
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
    const entry = await this.movies.get(key)
    if (!entry || entry.favsId !== favsId) {
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
    const entry = await this.series.get(key)
    if (!entry || entry.favsId !== favsId) {
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
    const entry = await this.seasons.get(key)
    if (!entry || entry.favsId !== favsId) {
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
