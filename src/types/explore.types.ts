import type { ExploreCollection, ExplorePerson, ExploreResponse } from './ajax.types'
import type { FetchableState } from './store.types'

export interface ExploreQuery<T> extends FetchableState {
  id: string
  response: T | null
}

export interface ExploreStoreState {
  open: boolean
  queries: ExploreQuery<ExploreResponse>[]
  persons: ExploreQuery<ExplorePerson>[]
  collections: ExploreQuery<ExploreCollection>[]
}
