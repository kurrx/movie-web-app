import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { queryProfileItems } from '@/api'
import { Button, Skeleton } from '@/components'
import { ExploreItemCardLoader, ExploreItems } from '@/features/explore'
import { useAppSelector } from '@/hooks'
import { FirestoreProfileItemType, QueryProfileItemsResult, SearchItem } from '@/types'

export interface ProfileItemsScrollProps {
  type: FirestoreProfileItemType
  count: number
}

export function ProfileItemsScroll({ type, count }: ProfileItemsScrollProps) {
  const uid = useAppSelector((state) => state.profile.user!.uid)
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<SearchItem[]>([])
  const next = useRef<QueryProfileItemsResult['next'] | null>(null)
  const signal = useRef<AbortController | null>(null)
  const remaining = useMemo(() => count - items.length, [items, count])
  const loadersCount = useMemo(() => Math.min(12, remaining), [remaining])

  const get = useCallback(() => {
    if (signal.current) signal.current.abort()

    setLoading(true)
    const controller = (signal.current = new AbortController())
    queryProfileItems(uid, { type })
      .then((result) => {
        if (!controller.signal.aborted) {
          signal.current = null
          setItems(result.items)
          setLoading(false)
          next.current = result.next
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          signal.current = null
          setLoading(false)
        }
      })
  }, [uid, type])

  const onLoadMore = useCallback(() => {
    if (!next.current) return
    setLoading(true)
    next
      .current()
      .then((result) => {
        setItems((prev) => prev.concat(result.items))
        next.current = result.next
      })
      .finally(() => {
        setLoading(false)
      })
  }, [next])

  useEffect(get, [get])

  return (
    <Fragment>
      <ExploreItems items={items}>
        {loading &&
          Array.from({ length: loadersCount }).map((_, i) => <ExploreItemCardLoader key={i} />)}
      </ExploreItems>
      {!loading && remaining > 0 && next && (
        <Button className='mt-8 mx-auto' onClick={onLoadMore}>
          Load more titles...
        </Button>
      )}
      {loading && remaining > 12 && (
        <Skeleton className='mt-8 h-[2.25rem] w-[12rem] rounded-md mx-auto' />
      )}
    </Fragment>
  )
}
