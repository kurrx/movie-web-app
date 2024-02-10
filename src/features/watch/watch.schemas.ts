import { z } from 'zod'

export const ID = z.coerce.number().positive()

export const ItemState = z.object({
  translatorId: ID,
  timestamp: z.number().gte(0),
  quality: z.string(),
  season: z.number().positive().optional(),
  episode: z.number().positive().optional(),
  subtitle: z.string().nullable(),
})
export const ItemStates = z.record(ID, ItemState.optional())

export function getItemStatesLS() {
  const item = localStorage.getItem('item-states')
  if (!item) return null
  try {
    return ItemStates.parse(JSON.parse(item))
  } catch (err) {
    return null
  }
}

export function deleteItemStatesLS() {
  localStorage.removeItem('item-states')
}
