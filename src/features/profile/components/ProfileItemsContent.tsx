import { useMemo } from 'react'

import { capitalizeFirstLetter } from '@/api'
import { Skeleton } from '@/components'
import { ExploreItemsLoader } from '@/features/explore'
import { Title } from '@/features/router'
import { useAppSelector } from '@/hooks'
import { FirestoreProfileItemType } from '@/types'
import { ErrorView } from '@/views'

import { selectProfileCounters } from '../profile.slice'
import { ProfileItemsScroll } from './ProfileItemsScroll'

export function ProfileItemsContent({ type }: { type: FirestoreProfileItemType }) {
  const counters = useAppSelector(selectProfileCounters)
  const count = useMemo(() => counters && counters[type], [counters, type])
  const title = useMemo(() => capitalizeFirstLetter(type), [type])

  if (!counters || count === null) {
    return (
      <div className='w-full max-w-full flex-1 flex flex-col'>
        <Title>Loading...</Title>
        <div className='container flex-1 flex flex-col mt-8 mb-16'>
          <Skeleton className='w-[10rem] sm:h-10 h-8 rounded-md' />
          <Skeleton className='mt-1 h-5 w-[15rem] rounded-md' />
          <ExploreItemsLoader />
          <Skeleton className='mt-8 h-[2.25rem] w-[12rem] rounded-md mx-auto' />
        </div>
      </div>
    )
  }

  if (count === 0) {
    return <ErrorView title='Oops' subtitle='Nothing found.' docTitle='Not Found' />
  }

  return (
    <div className='w-full max-w-full flex-1 flex flex-col'>
      <Title>{title}</Title>
      <div className='container flex-1 flex flex-col mt-8 mb-16'>
        <h1 className='sm:text-4xl text-2xl font-bold'>{title}</h1>
        <p className='text-muted-foreground'>
          You have {count} title{count === 1 ? '' : 's'} in total in your {type} list.
        </p>
        <ProfileItemsScroll type={type} count={count} />
      </div>
    </div>
  )
}
