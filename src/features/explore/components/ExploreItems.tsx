import { Fragment } from 'react'

import { ExploreResponse } from '@/types'

import { ExploreItemCard } from './ExploreItemCard'
import { ExplorePagination } from './ExplorePagination'

export interface ExploreItemsProps {
  url: string
  response: ExploreResponse
}

export function ExploreItems({ url, response }: ExploreItemsProps) {
  return (
    <Fragment>
      <div className='container mt-8'>
        <div className='w-full grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
          {response.items.map((item) => (
            <ExploreItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
      {response.pagination && <ExplorePagination url={url} pagination={response.pagination} />}
    </Fragment>
  )
}
