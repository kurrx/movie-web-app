import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { ExploreContent } from '@/features'

import { ErrorView } from './ErrorView'

export function ExploreView() {
  const location = useLocation()
  const url = useMemo(() => {
    let baseUrl = location.pathname.replace('/explore', '')
    if (!baseUrl.endsWith('/')) {
      baseUrl += '/'
    }
    return baseUrl
  }, [location])
  const query = useMemo(() => location.search, [location])
  const requestUrl = useMemo(() => url + query, [url, query])

  if (!requestUrl || requestUrl === '/' || url === '/') {
    return <ErrorView title='404' subtitle='Page not found.' docTitle='Not Found' />
  }

  return <ExploreContent key={requestUrl} url={requestUrl} />
}
