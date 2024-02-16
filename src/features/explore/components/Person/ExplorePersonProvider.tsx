import { useAppSelector } from '@/hooks'
import { ExplorePerson } from '@/types'

import { selectExplorePerson } from '../../explore.slice'

export interface ExplorePersonProviderProps {
  id: string
  children: (person: ExplorePerson) => React.ReactNode
}

export function ExplorePersonProvider({ id, children }: ExplorePersonProviderProps) {
  const person = useAppSelector((state) => selectExplorePerson(state, id))

  return <div className='w-full max-w-full flex-1 flex flex-col'>{children(person)}</div>
}
