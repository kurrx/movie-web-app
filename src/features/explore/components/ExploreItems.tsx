import { Fragment } from 'react'

import { ExplorePagination as IExplorePagination, SearchItem } from '@/types'

import { ExploreItemCard } from './ExploreItemCard'
import { ExplorePagination } from './ExplorePagination'

export interface ExploreItemsProps {
  items: SearchItem[]
  url?: string
  pagination?: IExplorePagination
}

export function ExploreItems(props: ExploreItemsProps) {
  const { items, url, pagination } = props

  return (
    <Fragment>
      <div className='w-full grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8'>
        {items.map((item) => (
          <ExploreItemCard key={item.id} item={item} />
        ))}
      </div>
      {pagination && url && <ExplorePagination url={url} pagination={pagination} />}
    </Fragment>
  )
}
