import { Fragment, useCallback, useEffect, useMemo } from 'react'

import { FetchState } from '@/core'
import { Title } from '@/features/router'
import { useStore } from '@/hooks'
import { FallbackView } from '@/views'

import { exploreSearch, selectExploreResult } from '../../explore.slice'
import { ExploreProvider } from './ExploreProvider'
import { ExploreResult } from './ExploreResult'
import { ExploreResultLoader } from './ExploreResultLoader'

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
      customLoadingView={
        <Fragment>
          <Title>Loading titles...</Title>
          <ExploreResultLoader />
        </Fragment>
      }
      error={exploreItem?.error}
      onReload={get}
    >
      <ExploreProvider url={url}>
        {(response) => (
          <Fragment>
            <Title>{response.title}</Title>
            <ExploreResult url={url} response={response} />
          </Fragment>
        )}
      </ExploreProvider>
    </FallbackView>
  )
}
