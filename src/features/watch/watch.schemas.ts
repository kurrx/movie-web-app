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

export function getItemStates() {
  const item = localStorage.getItem('item-states')
  if (!item) return {}
  try {
    return ItemStates.parse(JSON.parse(item))
  } catch (err) {
    return {}
  }
}

export function saveItemStates(states: z.infer<typeof ItemStates>) {
  localStorage.setItem('item-states', JSON.stringify(states))
}
