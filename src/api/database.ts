import Dexie, { Table } from 'dexie'

import {
  FetchStreamDownloadSizeArgs,
  FetchStreamThumbnailArgs,
  ItemModel,
  MovieSizeKey,
  MovieSizeModel,
  MovieThumbnailsKey,
  MovieThumbnailsModel,
  SeriesSizeKey,
  SeriesSizeModel,
  SeriesThumbnailsKey,
  SeriesThumbnailsModel,
} from '@/types'

class Database extends Dexie {
  private static readonly CACHE_HRS = 24
  items!: Table<ItemModel, number>
  moviesSizes!: Table<MovieSizeModel, MovieSizeKey>
  seriesSizes!: Table<SeriesSizeModel, SeriesSizeKey>
  moviesThumbnails!: Table<MovieThumbnailsModel, MovieThumbnailsKey>
  seriesThumbnails!: Table<SeriesThumbnailsModel, SeriesThumbnailsKey>

  constructor() {
    super('tv-db')
    this.version(1).stores({
      items: 'id',
      moviesSizes: '[id+translatorId+qualityId]',
      seriesSizes: '[id+translatorId+qualityId+season+episode]',
      moviesThumbnails: '[id+translatorId]',
      seriesThumbnails: '[id+translatorId+season+episode]',
    })
  }

  private static isExpired(entry: { updatedAt: Date }) {
    return Date.now() - entry.updatedAt.getTime() > 1000 * 60 * 60 * Database.CACHE_HRS
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

  private async getMovieSize(args: FetchStreamDownloadSizeArgs, fetch: () => Promise<number>) {
    const { id, translatorId, qualityId } = args
    const entry = await this.moviesSizes.get({ id, translatorId, qualityId })
    if (!entry) {
      const size = await fetch()
      const date = new Date()
      this.moviesSizes.add({
        id,
        translatorId,
        qualityId,
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
    const entry = await this.seriesSizes.get({ id, translatorId, qualityId, season, episode })
    if (!entry) {
      const size = await fetch()
      const date = new Date()
      this.seriesSizes.add({
        id,
        translatorId,
        qualityId,
        season: season!,
        episode: episode!,
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
    const entry = await this.moviesThumbnails.get({ id, translatorId })
    if (!entry) {
      const content = await fetch()
      const date = new Date()
      this.moviesThumbnails.add({
        id,
        translatorId,
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
    const entry = await this.seriesThumbnails.get({ id, translatorId, season, episode })
    if (!entry) {
      const content = await fetch()
      const date = new Date()
      this.seriesThumbnails.add({
        id,
        translatorId,
        season: season!,
        episode: episode!,
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
}

export const db = new Database()
