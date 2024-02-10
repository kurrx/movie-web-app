import Dexie, { Table } from 'dexie'

import { ItemModel } from '@/types'

class Database extends Dexie {
  private static readonly CACHE_HRS = 24
  items!: Table<ItemModel, number>

  constructor() {
    super('tv-db')
    this.version(1).stores({
      items: 'id',
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
        this.items.add({ id, html, updatedAt: date, createdAt: date })
      } else {
        this.items.update(id, { html, updatedAt: date })
      }
      return document
    }
    return new DOMParser().parseFromString(entry.html, 'text/html')
  }
}

export const db = new Database()
