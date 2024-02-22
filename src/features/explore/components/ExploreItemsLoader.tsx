import { Fragment } from 'react'

import { ExploreItemCardLoader } from './ExploreItemCardLoader'
import { ExplorePaginationLoader } from './ExplorePaginationLoader'

export interface ExploreItemsLoaderProps {
  count?: number
  pagination?: boolean
}

export function ExploreItemsLoader({ count = 12, pagination = false }: ExploreItemsLoaderProps) {
  return (
    <Fragment>
      <div className='w-full grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8'>
        {Array.from({ length: count }).map((_, i) => (
          <ExploreItemCardLoader key={i} />
        ))}
      </div>
      {pagination && <ExplorePaginationLoader />}
    </Fragment>
  )
}
