import { Fragment, useCallback, useEffect, useMemo } from 'react'

import { FetchState } from '@/core'
import { useStore } from '@/hooks'
import { FallbackView } from '@/views'

import { exploreSearch, selectExploreResult } from '../explore.slice'
import { ExplorePagination } from './ExplorePagination'
import { ExploreProvider } from './ExploreProvider'

export function ExploreContent({ url }: { url: string }) {
  const [dispatch, selector] = useStore()
  const exploreItem = selector((state) => selectExploreResult(state, url))
  const state = useMemo(() => exploreItem?.state || FetchState.LOADING, [exploreItem])

  const get = useCallback(() => {
    const signal = dispatch(exploreSearch(url))
    return () => {
      signal.abort()
    }
  }, [dispatch, url])

  useEffect(get, [get])

  return (
    <FallbackView
      dismissible
      state={state}
      text='Loading titles...'
      error={exploreItem?.error}
      onReload={get}
    >
      <ExploreProvider url={url}>
        {(response) => (
          <Fragment>
            {response.pagination && (
              <ExplorePagination url={url} pagination={response.pagination} />
            )}
          </Fragment>
        )}
      </ExploreProvider>
    </FallbackView>
  )
}
