import { useCallback, useEffect, useMemo } from 'react'

import { FetchState } from '@/core'
import { useStore } from '@/hooks'
import { ItemFullID } from '@/types'
import { FallbackView } from '@/views/FallbackView'

import { getItem, selectWatchItemOptional } from '../watch.slice'
import { WatchInfo } from './WatchInfo'

export interface WatchContentProps {
  fullId: ItemFullID
}

export function WatchContent({ fullId }: WatchContentProps) {
  const [dispatch, selector] = useStore()
  const id = useMemo(() => fullId.id, [fullId])
  const watchItem = selector((state) => selectWatchItemOptional(state, id))
  const state = useMemo(() => watchItem?.state || FetchState.LOADING, [watchItem])

  const get = useCallback(() => {
    const signal = dispatch(getItem(fullId))
    return () => void signal.abort()
  }, [dispatch, fullId])

  useEffect(get, [get])

  return (
    <FallbackView
      dismissible
      state={state}
      text='Be patient. Title is loading...'
      error={watchItem?.error}
      onReload={get}
    >
      <div className='flex-1 flex flex-col'>
        <WatchInfo id={fullId.id} />
      </div>
    </FallbackView>
  )
}
