import { Fragment } from 'react'

import { Title } from '@/features/router'
import { useAppSelector } from '@/hooks'

import { selectWatchItemQualities, selectWatchItemTitle } from '../../watch.slice'
import { WatchInfoDownload } from './WatchInfoDownload'

export interface WatchInfoProps {
  id: number
}

export function WatchInfo({ id }: WatchInfoProps) {
  const title = useAppSelector((state) => selectWatchItemTitle(state, id))
  const qualities = useAppSelector((state) => selectWatchItemQualities(state, id))

  return (
    <Fragment>
      <Title>{title}</Title>
      <div className='container mt-4'>
        <div className='flex items-center justify-between'>
          <h1 className='font-bold text-xl'>{title}</h1>
          <WatchInfoDownload title={title} qualities={qualities} />
        </div>
      </div>
    </Fragment>
  )
}
