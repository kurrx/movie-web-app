import { SearchItem } from './ajax.types'
import { FetchableState } from './store.types'

export interface SearchQuery extends FetchableState {
  query: string
  results: SearchItem[] | null
}

export interface SearchStoreState {
  open: boolean
  disabled: boolean
  queries: SearchQuery[]
}
