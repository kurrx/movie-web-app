import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import { cn } from '@/api'
import { Skeleton } from '@/components'
import { ItemPerson } from '@/types'

export function Person({ person }: { person: ItemPerson }) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <NavLink to={`/explore${person.url}`} className='w-[15rem] shrink-0 flex items-center'>
      <img
        src={person.photoUrl}
        alt={person.name}
        className={cn(
          'object-contain h-16 w-10 shrink-0 mr-4',
          !imageLoaded ? 'hidden' : 'inline-block',
        )}
        onLoad={() => setImageLoaded(true)}
      />
      <Skeleton
        className={cn('h-16 w-10 shrink-0 mr-4 !rounded-none', !imageLoaded ? 'block' : 'hidden')}
      />
      <span className='grow min-w-0'>
        <p className='truncate font-bold text-sm'>{person.name}</p>
        <p className='truncate text-xs text-muted-foreground'>{person.job}</p>
      </span>
    </NavLink>
  )
}
