import { useAppSelector } from '@/hooks'
import { ExploreResponse } from '@/types'

import { selectExploreResponse } from '../../explore.slice'

export interface ExploreProviderProps {
  url: string
  children: (response: ExploreResponse) => React.ReactNode
}

export function ExploreProvider({ url, children }: ExploreProviderProps) {
  const response = useAppSelector((state) => selectExploreResponse(state, url))

  return <div className='w-full max-w-full flex-1 flex flex-col'>{children(response)}</div>
}
