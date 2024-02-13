import { Fragment, useCallback, useState } from 'react'

import { cn } from '@/api'
import { EyeIcon, ShareIcon } from '@/assets'
import { Button } from '@/components'
import { Title } from '@/features/router'
import { useAppSelector } from '@/hooks'

import {
  selectWatchItem,
  selectWatchItemEpisodeTitle,
  selectWatchItemFullTitle,
  selectWatchItemQualities,
} from '../../watch.slice'
import { WatchInfoDownload } from './WatchInfoDownload'

export interface WatchInfoProps {
  id: number
}

export function WatchInfo({ id }: WatchInfoProps) {
  const item = useAppSelector((state) => selectWatchItem(state, id))
  const title = useAppSelector((state) => selectWatchItemFullTitle(state, id))
  const episodeTitle = useAppSelector((state) => selectWatchItemEpisodeTitle(state, id))
  const qualities = useAppSelector((state) => selectWatchItemQualities(state, id))
  const [watched, setWatched] = useState(false)

  const toggleWatched = useCallback(() => {
    setWatched((prev) => !prev)
  }, [])

  return (
    <Fragment>
      <Title>{title}</Title>
      <div className='container mt-4'>
        <h1 className='font-bold text-xl'>{item.title}</h1>
        {episodeTitle && (
          <h2 className='font-medium text-md text-muted-foreground'>{episodeTitle}</h2>
        )}
      </div>
      <div className='w-full overflow-x-scroll space-x-2 flex items-center py-4 px-4 no-scrollbar sm:container'>
        <Button disabled className='rounded-full' variant='secondary' onClick={toggleWatched}>
          <EyeIcon
            className={cn(
              'mr-2 h-5 w-5 transition-colors',
              'data-[active=true]:text-[var(--ui-primary)]',
            )}
            data-active={watched}
          />
          Watched
        </Button>
        <Button disabled className='rounded-full' variant='secondary'>
          <ShareIcon className='mr-2 h-5 w-5' />
          Share
        </Button>
        <WatchInfoDownload title={title} qualities={qualities} />
      </div>
      <div className='container mb-16'>
        {item.description && <p className='text-sm'>{item.description}</p>}
      </div>
    </Fragment>
  )
}
