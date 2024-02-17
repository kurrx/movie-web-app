import { Fragment, useCallback, useEffect, useMemo } from 'react'

import { FetchState } from '@/core'
import { Title } from '@/features/router'
import { useStore } from '@/hooks'
import { FallbackView } from '@/views'

import { exploreCollections, selectExploreCollectionsResult } from '../../explore.slice'
import { ExploreCollectionsProvider } from './ExploreCollectionsProvider'

export function ExploreCollectionsContent({ url }: { url: string }) {
  const [dispatch, selector] = useStore()
  const collectionsResult = selector((state) => selectExploreCollectionsResult(state, url))
  const state = useMemo(() => collectionsResult?.state || FetchState.LOADING, [collectionsResult])

  const get = useCallback(() => {
    const signal = dispatch(exploreCollections(url))
    return () => {
      signal.abort()
    }
  }, [dispatch, url])

  useEffect(get, [get])

  return (
    <FallbackView
      dismissible
      state={state}
      text='Loading collections...'
      error={collectionsResult?.error}
      onReload={get}
    >
      <ExploreCollectionsProvider url={url}>
        {(collections) => (
          <Fragment>
            <Title>{collections.title}</Title>
          </Fragment>
        )}
      </ExploreCollectionsProvider>
    </FallbackView>
  )
}
