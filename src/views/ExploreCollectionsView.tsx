import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { ExploreCollectionsContent } from '@/features'

import { ErrorView } from './ErrorView'

export function ExploreCollectionsView() {
  const location = useLocation()
  const url = useMemo(() => {
    let baseUrl = location.pathname.replace('/explore', '')
    if (!baseUrl.endsWith('/')) {
      baseUrl += '/'
    }
    return baseUrl
  }, [location])

  if (!url) {
    return <ErrorView title='404' subtitle='Page not found.' docTitle='Not Found' />
  }

  return <ExploreCollectionsContent key={url} url={url} />
}
