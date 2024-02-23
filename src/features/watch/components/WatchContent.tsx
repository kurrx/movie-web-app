import { Fragment, useCallback, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import { FetchState } from '@/core'
import { Title } from '@/features/router'
import { useStore } from '@/hooks'
import { ItemFullID, WatchItemState } from '@/types'
import { FallbackView } from '@/views/FallbackView'

import { getItem, selectWatchItemOptional } from '../watch.slice'
import { WatchContentLoader } from './WatchContentLoader'
import { WatchInfo } from './WatchInfo'
import { WatchPlayer } from './WatchPlayer'

function queryToNum(query: URLSearchParams, key: string) {
  const value = query.get(key)
  if (!value) return null
  const number = parseInt(value)
  if (isNaN(number)) return null
  return number
}

export function WatchContent({ fullId }: { fullId: ItemFullID }) {
  const [dispatch, selector] = useStore()
  const [query, setQuery] = useSearchParams()
  const id = useMemo(() => fullId.id, [fullId])
  const nextState = useMemo(() => {
    const translatorId = queryToNum(query, 'tr')
    const timestamp = queryToNum(query, 't')
    if (typeof translatorId !== 'number' || typeof timestamp !== 'number') return null
    const state: WatchItemState = {
      translatorId,
      timestamp,
      quality: 'auto',
      subtitle: 'null',
    }
    const season = queryToNum(query, 's')
    const episode = queryToNum(query, 'e')
    if (typeof season === 'number' && typeof episode === 'number') {
      state.season = season
      state.episode = episode
    }
    return state
  }, [query])
  const watchItem = selector((state) => selectWatchItemOptional(state, id))
  const state = useMemo(() => watchItem?.state || FetchState.LOADING, [watchItem])

  const get = useCallback(() => {
    const signal = dispatch(getItem({ fullId, nextState }))
    return () => {
      signal.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, fullId])

  useEffect(() => {
    if (watchItem?.state !== FetchState.SUCCESS) return
    setQuery(new URLSearchParams(), { replace: true })
  }, [watchItem, setQuery])

  useEffect(get, [get])

  return (
    <FallbackView
      dismissible
      state={state}
      text='Be patient. Title is loading...'
      customLoadingView={
        <Fragment>
          <Title>Loading title...</Title>
          <WatchContentLoader />
        </Fragment>
      }
      error={watchItem?.error}
      onReload={get}
    >
      <div className='w-full max-w-full flex-1 flex flex-col'>
        <WatchPlayer id={fullId.id} />
        <WatchInfo id={fullId.id} />
      </div>
    </FallbackView>
  )
}
