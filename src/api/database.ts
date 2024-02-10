import Dexie, { Table } from 'dexie'

import {
  AjaxMovieModel,
  AjaxSeriesEpisodesStreamModel,
  AjaxSeriesStreamModel,
  FetchMovieStreamArgs,
  FetchSeriesEpisodesStreamArgs,
  FetchSeriesStreamArgs,
  FetchStreamDownloadSizeArgs,
  FetchStreamThumbnailArgs,
  ItemModel,
  SeriesEpisodesStreamSuccessResponse,
  StreamSizeModel,
  StreamSuccessResponse,
  StreamThumbnailsModel,
} from '@/types'

class Database extends Dexie {
  private static readonly CACHE_HRS = 24
  items!: Table<ItemModel, number>
  ajaxMovies!: Table<AjaxMovieModel, number>
  ajaxSeriesStreams!: Table<AjaxSeriesStreamModel, number>
  ajaxSeriesEpisodesStreams!: Table<AjaxSeriesEpisodesStreamModel, number>
  streamThumbnails!: Table<StreamThumbnailsModel, string>
  streamSizes!: Table<StreamSizeModel, string>

  constructor() {
    super('tv-db')
    this.version(1).stores({
      items: 'id',
      ajaxMovies: '++pk, [id+translatorId]',
      ajaxSeriesStreams: '++pk, [id+translatorId]',
      ajaxSeriesEpisodesStreams: '++pk, [id+translatorId]',
      streamThumbnails: '++pk, [id+translatorId]',
      streamSizes: '++pk, [id+translatorId+qualityId]',
    })
  }

  private static isExpired(entry: { updatedAt: number }) {
    return Date.now() - entry.updatedAt > 1000 * 60 * 60 * Database.CACHE_HRS
  }

  async getItem(id: number, fetch: () => Promise<Document>) {
    const entry = await this.items.get(id)
    if (!entry || Database.isExpired(entry)) {
      const document = await fetch()
      const html = document.documentElement.innerHTML
      this.items.put({ id, html, updatedAt: Date.now() })
      return document
    }
    return new DOMParser().parseFromString(entry.html, 'text/html')
  }

  async getAjaxMovie(args: FetchMovieStreamArgs, fetch: () => Promise<StreamSuccessResponse>) {
    const entry = await this.ajaxMovies
      .where({ id: args.id, translatorId: args.translatorId })
      .filter(
        (entry) =>
          entry.isAds === args.isAds &&
          entry.isCamrip === args.isCamrip &&
          entry.isDirector === args.isDirector,
      )
      .first()
    if (!entry || Database.isExpired(entry) || entry.favsId !== args.favsId) {
      const data = await fetch()
      this.ajaxMovies.put({
        id: args.id,
        translatorId: args.translatorId,
        favsId: args.favsId,
        isCamrip: args.isCamrip,
        isAds: args.isAds,
        isDirector: args.isDirector,
        data,
        updatedAt: Date.now(),
      })
      return data
    }
    return entry.data
  }

  async getAjaxSeriesStream(
    args: FetchSeriesStreamArgs,
    fetch: () => Promise<StreamSuccessResponse>,
  ) {
    const entry = await this.ajaxSeriesStreams
      .where({ id: args.id, translatorId: args.translatorId })
      .filter((entry) => entry.season === args.season && entry.episode === args.episode)
      .first()
    if (!entry || Database.isExpired(entry) || entry.favsId !== args.favsId) {
      const data = await fetch()
      this.ajaxSeriesStreams.put({
        id: args.id,
        translatorId: args.translatorId,
        favsId: args.favsId,
        season: args.season,
        episode: args.episode,
        data,
        updatedAt: Date.now(),
      })
      return data
    }
    return entry.data
  }

  async getAjaxSeriesEpisodesStream(
    args: FetchSeriesEpisodesStreamArgs,
    fetch: () => Promise<SeriesEpisodesStreamSuccessResponse>,
  ) {
    const entry = await this.ajaxSeriesEpisodesStreams
      .where({ id: args.id, translatorId: args.translatorId })
      .filter((entry) => entry.season === args.season && entry.episode === args.episode)
      .first()
    if (!entry || Database.isExpired(entry) || entry.favsId !== args.favsId) {
      const data = await fetch()
      this.ajaxSeriesEpisodesStreams.put({
        id: args.id,
        translatorId: args.translatorId,
        favsId: args.favsId,
        season: args.season,
        episode: args.episode,
        data,
        updatedAt: Date.now(),
      })
      return data
    }
    return entry.data
  }

  async getStreamSize(args: FetchStreamDownloadSizeArgs, fetch: () => Promise<number>) {
    const entry = await this.streamSizes
      .where({ id: args.id, translatorId: args.translatorId, qualityId: args.qualityId })
      .filter((entry) => entry.season === args.season && entry.episode === args.episode)
      .first()
    if (!entry) {
      const size = await fetch()
      this.streamSizes.put({
        id: args.id,
        translatorId: args.translatorId,
        season: args.season,
        episode: args.episode,
        qualityId: args.qualityId,
        size,
      })
      return size
    }
    return entry.size
  }

  async getStreamThumbnail(args: FetchStreamThumbnailArgs, fetch: () => Promise<string>) {
    const entry = await this.streamThumbnails
      .where({ id: args.id, translatorId: args.translatorId })
      .filter((entry) => entry.season === args.season && entry.episode === args.episode)
      .first()
    if (!entry) {
      const content = await fetch()
      this.streamThumbnails.put({
        id: args.id,
        translatorId: args.translatorId,
        season: args.season,
        episode: args.episode,
        content,
      })
      return content
    }
    return entry.content
  }
}

export const db = new Database()
