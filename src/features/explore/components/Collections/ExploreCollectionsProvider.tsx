import { useAppSelector } from '@/hooks'
import { ExploreCollection } from '@/types'

import { selectExploreCollections } from '../../explore.slice'

export interface ExploreCollectionsProviderProps {
  url: string
  children: (collections: ExploreCollection) => React.ReactNode
}

export function ExploreCollectionsProvider({ url, children }: ExploreCollectionsProviderProps) {
  const collection = useAppSelector((state) => selectExploreCollections(state, url))

  return <div className='w-full max-w-full flex-1 flex flex-col'>{children(collection)}</div>
}
