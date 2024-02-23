import { Fragment, PropsWithChildren } from 'react'

import { ExplorePagination as IExplorePagination, SearchItem } from '@/types'

import { ExploreItemCard } from './ExploreItemCard'
import { ExplorePagination } from './ExplorePagination'

export interface ExploreItemsProps extends PropsWithChildren {
  items: SearchItem[]
  url?: string
  pagination?: IExplorePagination
}

export function ExploreItems(props: ExploreItemsProps) {
  const { items, url, pagination, children } = props

  return (
    <Fragment>
      <div className='w-full grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8'>
        {items.map((item) => (
          <ExploreItemCard key={item.id} item={item} />
        ))}
        {children}
      </div>
      {pagination && url && <ExplorePagination url={url} pagination={pagination} />}
    </Fragment>
  )
}
