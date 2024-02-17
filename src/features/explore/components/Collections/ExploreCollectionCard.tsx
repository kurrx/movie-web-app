import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { cn } from '@/api'
import { Badge, Skeleton } from '@/components'
import { ExploreCollectionItem } from '@/types'

export interface ExploreCollectionCardProps {
  collection: ExploreCollectionItem
}

export function ExploreCollectionCard({ collection }: ExploreCollectionCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const to = useMemo(() => `/explore${collection.url}`, [collection])

  return (
    <NavLink to={to} className='w-full'>
      <div className='relative w-full rounded-xl overflow-hidden light'>
        <div className='pb-[calc((15/26)*100%)]' />
        <img
          src={collection.imageUrl}
          alt={collection.title}
          className={cn(
            'absolute w-full h-full top-0 left-0 object-cover',
            !imageLoaded ? 'hidden' : 'inline-block',
          )}
          onLoad={() => setImageLoaded(true)}
        />
        <Skeleton
          className={cn('absolute w-full h-full top-0 left-0 ', !imageLoaded ? 'block' : 'hidden')}
        />
        <div className='absolute w-full h-full top-0 left-0 bg-black/35 backdrop-blur-md' />
        <div className='absolute w-full h-full top-0 left-0 p-4 flex items-center justify-center'>
          <h2 className='text-xl text-white text-center font-bold'>{collection.title}</h2>
        </div>
        <Badge
          variant='secondary'
          className='absolute top-[0.5rem] right-[0.5rem] select-none pointer-events-none'
        >
          {collection.count}
        </Badge>
      </div>
    </NavLink>
  )
}
