import Dexie, { Table } from 'dexie'

import {
  AjaxMovieModel,
  FetchMovieStreamArgs,
  ItemModel,
  StreamSizeModel,
  StreamSuccessResponse,
  StreamThumbnailsModel,
} from '@/types'

class Database extends Dexie {
  private static readonly CACHE_HRS = 24
  items!: Table<ItemModel, number>
  ajaxMovies!: Table<AjaxMovieModel, number>
  streamThumbnails!: Table<StreamThumbnailsModel, string>
  streamSizes!: Table<StreamSizeModel, string>

  constructor() {
    super('tv-db')
    this.version(1).stores({
      items: 'id, updatedAt',
      ajaxMovies: '[id+translatorId+favsId+isCamrip+isAds+isDirector], updatedAt',
      streamThumbnails: 'id',
      streamSizes: 'id, size',
    })
  }

  async getItem(id: number, fetch: () => Promise<Document>) {
    const entry = await this.items.get(id)
    if (!entry || Date.now() - entry.updatedAt > 1000 * 60 * 60 * Database.CACHE_HRS) {
      const document = await fetch()
      const html = document.documentElement.innerHTML
      this.items.put({ id, html, updatedAt: Date.now() })
      return document
    }
    return new DOMParser().parseFromString(entry.html, 'text/html')
  }

  async getAjaxMovie(args: FetchMovieStreamArgs, fetch: () => Promise<StreamSuccessResponse>) {
    const entry = await this.ajaxMovies
      .where({
        id: args.id,
        translatorId: args.translatorId,
        favsId: args.favsId,
        isCamrip: Number(args.isCamrip),
        isAds: Number(args.isAds),
        isDirector: Number(args.isDirector),
      })
      .first()
    if (!entry || Date.now() - entry.updatedAt > 1000 * 60 * 60 * Database.CACHE_HRS) {
      const data = await fetch()
      this.ajaxMovies.put({
        id: args.id,
        translatorId: args.translatorId,
        favsId: args.favsId,
        isCamrip: Number(args.isCamrip),
        isAds: Number(args.isAds),
        isDirector: Number(args.isDirector),
        data,
        updatedAt: Date.now(),
      })
      return data
    }
    return entry.data
  }

  async getStreamSize(id: string, fetch: () => Promise<number>) {
    const entry = await this.streamSizes.get(id)
    if (!entry) {
      const size = await fetch()
      this.streamSizes.put({ id, size })
      return size
    }
    return entry.size
  }

  async getStreamThumbnail(id: string, fetch: () => Promise<string>) {
    const entry = await this.streamThumbnails.get(id)
    if (!entry) {
      const thumbnails = await fetch()
      this.streamThumbnails.put({ id, content: thumbnails })
      return thumbnails
    }
    return entry.content
  }
}

export const db = new Database()
