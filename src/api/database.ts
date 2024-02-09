import Dexie, { Table } from 'dexie'

import { StreamSizeModel, StreamThumbnailsModel } from '@/types'

class Database extends Dexie {
  streamThumbnails!: Table<StreamThumbnailsModel, string>
  streamSizes!: Table<StreamSizeModel, string>

  constructor() {
    super('tv-db')
    this.version(1).stores({
      streamThumbnails: 'id',
      streamSizes: 'id, size',
    })
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
