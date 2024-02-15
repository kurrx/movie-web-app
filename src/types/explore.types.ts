import type { ExploreResponse } from './ajax.types'
import type { FetchableState } from './store.types'

export interface ExploreQuery extends FetchableState {
  url: string
  response: ExploreResponse | null
}

export interface ExploreStoreState {
  open: boolean
  queries: ExploreQuery[]
}
