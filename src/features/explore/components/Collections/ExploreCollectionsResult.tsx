import { Fragment } from 'react'

import { ExploreCollection } from '@/types'
import { ErrorView } from '@/views'

import { ExplorePagination } from '../ExplorePagination'
import { ExploreCollectionCard } from './ExploreCollectionCard'

export interface ExploreCollectionsResultProps {
  url: string
  collections: ExploreCollection
}

export function ExploreCollectionsResult({ url, collections }: ExploreCollectionsResultProps) {
  return (
    <div className='container flex-1 flex flex-col mt-8 mb-16'>
      <h1 className='sm:text-4xl text-2xl font-bold'>{collections.title}</h1>
      {collections.items.length > 0 ? (
        <Fragment>
          <div className='w-full grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8'>
            {collections.items.map((collection) => (
              <ExploreCollectionCard key={collection.url} collection={collection} />
            ))}
          </div>
          {collections.pagination && (
            <ExplorePagination url={url} pagination={collections.pagination} />
          )}
        </Fragment>
      ) : (
        <ErrorView title='Oops' subtitle='Nothing found.' docTitle='Not Found' />
      )}
    </div>
  )
}
