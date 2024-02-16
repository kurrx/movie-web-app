import { useParams } from 'react-router-dom'

import { ExplorePersonContent } from '@/features'

import { ErrorView } from './ErrorView'

export function ExplorePerson() {
  const { personId } = useParams<{ personId?: string }>()

  if (!personId) {
    return <ErrorView title='404' subtitle='Page not found.' docTitle='Not Found' />
  }

  return <ExplorePersonContent id={personId} />
}
