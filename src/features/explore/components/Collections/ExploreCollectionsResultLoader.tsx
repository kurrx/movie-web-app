import { Skeleton } from '@/components'

import { ExplorePaginationLoader } from '../ExplorePaginationLoader'
import { ExploreCollectionCardLoader } from './ExploreCollectionCardLoader'

export function ExploreCollectionsResultLoader() {
  return (
    <div className='container flex-1 flex flex-col mt-8 mb-16'>
      <Skeleton className='sm:w-[60%] w-[80%] sm:h-10 h-8 rounded-md' />
      <div className='w-full grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8'>
        {Array.from({ length: 12 }).map((_, i) => (
          <ExploreCollectionCardLoader key={i} />
        ))}
      </div>
      <ExplorePaginationLoader />
    </div>
  )
}
