import { Fragment, useCallback, useState } from 'react'

import { BookMarkIcon, EyeIcon, HeartIcon, ShareIcon } from '@/assets'
import { Title } from '@/features/router'
import { useAppSelector } from '@/hooks'

import {
  selectWatchItem,
  selectWatchItemEpisodeTitle,
  selectWatchItemFullTitle,
  selectWatchItemQualities,
} from '../../watch.slice'
import { WatchInfoButton } from './WatchInfoButton'
import { WatchInfoDescription } from './WatchInfoDescription'
import { WatchInfoDownload } from './WatchInfoDownload'

export interface WatchInfoProps {
  id: number
}

export function WatchInfo({ id }: WatchInfoProps) {
  const item = useAppSelector((state) => selectWatchItem(state, id))
  const title = useAppSelector((state) => selectWatchItemFullTitle(state, id))
  const episodeTitle = useAppSelector((state) => selectWatchItemEpisodeTitle(state, id))
  const qualities = useAppSelector((state) => selectWatchItemQualities(state, id))
  const [favorite, setFavorite] = useState(false)
  const [saved, setSaved] = useState(false)
  const [watched, setWatched] = useState(false)

  const toggleFavorite = useCallback(() => {
    setFavorite((prev) => !prev)
  }, [])

  const toggleSaved = useCallback(() => {
    setSaved((prev) => !prev)
  }, [])

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
        <WatchInfoButton disabled Icon={HeartIcon} active={favorite} onClick={toggleFavorite}>
          {favorite ? 'Remove' : 'Favorite'}
        </WatchInfoButton>
        <WatchInfoButton disabled Icon={BookMarkIcon} active={saved} onClick={toggleSaved}>
          {saved ? 'Saved' : 'Save'}
        </WatchInfoButton>
        <WatchInfoButton disabled notFill Icon={EyeIcon} active={watched} onClick={toggleWatched}>
          Watched
        </WatchInfoButton>
        <WatchInfoButton disabled Icon={ShareIcon}>
          Share
        </WatchInfoButton>
        <WatchInfoDownload title={title} qualities={qualities} />
      </div>
      <div className='container mb-16'>
        {item.description && <WatchInfoDescription>{item.description}</WatchInfoDescription>}
      </div>
    </Fragment>
  )
}
