import randomGradient from 'random-gradient'
import { NavLink } from 'react-router-dom'

import { ItemCollection } from '@/types'

export function Collection({ collection }: { collection: ItemCollection }) {
  return (
    <NavLink to={`/explore${collection.url}`} className='w-[20rem] shrink-0 flex items-center'>
      <span
        className='w-16 h-16 shrink-0 mr-4 rounded-md'
        style={{ backgroundImage: randomGradient(collection.title, 'diagonal') }}
      />
      <span className='grow min-w-0'>
        <p className='font-bold text-sm leading-[1.2]'>{collection.title}</p>
        {collection.place && (
          <p className='truncate text-xs !text-muted-foreground'>{collection.place} место</p>
        )}
      </span>
    </NavLink>
  )
}
