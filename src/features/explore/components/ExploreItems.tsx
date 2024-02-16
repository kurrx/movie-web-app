import { ExploreResponse } from '@/types'

import { ExploreItemCard } from './ExploreItemCard'
import { ExplorePagination } from './ExplorePagination'

export interface ExploreItemsProps {
  url: string
  response: ExploreResponse
}

export function ExploreItems({ url, response }: ExploreItemsProps) {
  return (
    <div className='container mt-8 mb-16'>
      <h1 className='text-xl font-bold'>{response.title}</h1>
      <div className='w-full grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8'>
        {response.items.map((item) => (
          <ExploreItemCard key={item.id} item={item} />
        ))}
      </div>
      {response.pagination && <ExplorePagination url={url} pagination={response.pagination} />}
    </div>
  )
}
