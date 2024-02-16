import { ExplorePerson } from '@/types'

import { ExploreItems } from '../ExploreItems'

export function ExplorePersonResult({ person }: { person: ExplorePerson }) {
  return (
    <div className='container mt-8 mb-16'>
      {person.rolesItems.map((role) => (
        <div key={role.title} className='mt-8'>
          <h2 className='text-lg font-bold'>{role.title}</h2>
          <h3 className='font-medium text-muted-foreground'>{role.subtitle}</h3>
          <ExploreItems items={role.items} />
        </div>
      ))}
    </div>
  )
}
