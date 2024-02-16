import type { ExplorePerson, ExploreResponse } from './ajax.types'
import type { FetchableState } from './store.types'

export interface ExploreQuery extends FetchableState {
  url: string
  response: ExploreResponse | null
}

export interface ExplorePersonQuery extends FetchableState {
  id: string
  person: ExplorePerson | null
}

export interface ExploreStoreState {
  open: boolean
  queries: ExploreQuery[]
  persons: ExplorePersonQuery[]
}
