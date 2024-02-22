import { Fragment, useCallback, useEffect, useMemo } from 'react'

import { FetchState } from '@/core'
import { Title } from '@/features/router'
import { useStore } from '@/hooks'
import { FallbackView } from '@/views'

import { explorePerson, selectExplorePersonResult } from '../../explore.slice'
import { ExplorePersonProvider } from './ExplorePersonProvider'
import { ExplorePersonResult } from './ExplorePersonResult'
import { ExplorePersonResultLoader } from './ExplorePersonResultLoader'

export function ExplorePersonContent({ id }: { id: string }) {
  const [dispatch, selector] = useStore()
  const personResult = selector((state) => selectExplorePersonResult(state, id))
  const state = useMemo(() => personResult?.state || FetchState.LOADING, [personResult])

  const get = useCallback(() => {
    const signal = dispatch(explorePerson(id))
    return () => {
      signal.abort()
    }
  }, [dispatch, id])

  useEffect(get, [get])

  return (
    <FallbackView
      dismissible
      state={state}
      customLoadingView={
        <Fragment>
          <Title>Loading person...</Title>
          <ExplorePersonResultLoader />
        </Fragment>
      }
      error={personResult?.error}
      onReload={get}
    >
      <ExplorePersonProvider id={id}>
        {(person) => (
          <Fragment>
            <Title>{person.name}</Title>
            <ExplorePersonResult person={person} />
          </Fragment>
        )}
      </ExplorePersonProvider>
    </FallbackView>
  )
}
