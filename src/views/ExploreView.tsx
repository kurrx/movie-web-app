import { useCallback, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { FetchState } from '@/core'
import { ExploreContent, exploreSearch, selectExploreResult } from '@/features'
import { useStore } from '@/hooks'

import { FallbackView } from './FallbackView'

export function ExploreView() {
  const [dispatch, selector] = useStore()
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
  const exploreItem = selector((state) => selectExploreResult(state, requestUrl))
  const state = useMemo(() => exploreItem?.state || FetchState.LOADING, [exploreItem])

  const get = useCallback(() => {
    const signal = dispatch(exploreSearch(requestUrl))
    return () => {
      signal.abort()
    }
  }, [dispatch, requestUrl])

  useEffect(get, [get])

  return (
    <FallbackView
      dismissible
      state={state}
      text='Loading titles...'
      error={exploreItem?.error}
      onReload={get}
    >
      <div className='w-full max-w-full flex-1 flex flex-col'>
        <ExploreContent url={requestUrl} />
      </div>
    </FallbackView>
  )
}
