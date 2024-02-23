import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { capitalizeFirstLetter, getProfileItems } from '@/api'
import { Skeleton } from '@/components'
import { ExploreItems, ExploreItemsLoader } from '@/features/explore'
import { useAppSelector } from '@/hooks'
import { FirestoreProfileItemType, ProfileCounters, SearchItem } from '@/types'

function ItemLoader() {
  return (
    <div className='mt-8'>
      <Skeleton className='h-[1.75rem] w-[5rem]' />
      <Skeleton className='mt-1 h-4 w-[8rem]' />
      <ExploreItemsLoader count={6} />
    </div>
  )
}

interface ItemProps {
  to: string
  title: string
  count: number
  type: FirestoreProfileItemType
}

function Item(props: ItemProps) {
  const { to, title, count, type } = props
  const uid = useAppSelector((state) => state.profile.user!.uid)
  const signal = useRef<AbortController | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [items, setItems] = useState<SearchItem[]>([])
  const subtitle = useMemo(() => {
    if (loading) return 'Loading...'
    if (count <= 6) return 'Shown all titles'
    return 'Shown last 6 titles'
  }, [loading, count])

  const get = useCallback(() => {
    if (signal.current) signal.current.abort()

    setLoading(true)
    const controller = (signal.current = new AbortController())
    getProfileItems(uid, type)
      .then((items) => {
        if (!controller.signal.aborted) {
          signal.current = null
          setItems(items)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          signal.current = null
          setError(true)
          setLoading(false)
        }
      })
  }, [uid, type])

  useEffect(get, [get])

  if (error) return null

  return (
    <div className='mt-8'>
      <NavLink to={to} className='flex items-center justify-between'>
        <div className='flex-1'>
          <h2 className='text-lg font-bold'>{title}</h2>
          <p className='text-sm font-medium text-muted-foreground'>{subtitle}</p>
        </div>
        <p className='text-lg font-black text-[var(--ui-primary)]'>{count}</p>
      </NavLink>
      {loading ? <ExploreItemsLoader count={count} /> : <ExploreItems items={items} />}
    </div>
  )
}

const countersList = ['saved', 'favorite', 'watched', 'rated'] as const

export function ProfileItems({ counters }: { counters: ProfileCounters | null }) {
  const hasAnyCounters = useMemo(
    () => countersList.some((counter) => !!counters && counters[counter] > 0),
    [counters],
  )

  if (!counters) {
    return (
      <Fragment>
        <ItemLoader />
        <ItemLoader />
        <ItemLoader />
        <ItemLoader />
      </Fragment>
    )
  }

  if (!hasAnyCounters) {
    return (
      <div className='flex-1 flex items-center justify-center'>
        <p className='text-lg font-bold text-muted-foreground'>Profile is empty</p>
      </div>
    )
  }

  return (
    <Fragment>
      {countersList
        .filter((type) => counters[type] > 0)
        .map((type) => (
          <Item
            key={type}
            to={`/profile/${type}`}
            title={capitalizeFirstLetter(type)}
            count={counters[type]}
            type={type}
          />
        ))}
    </Fragment>
  )
}
