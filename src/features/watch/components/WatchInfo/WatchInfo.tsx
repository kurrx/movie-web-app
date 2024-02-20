import { Fragment, useCallback, useMemo, useState } from 'react'

import { cn } from '@/api'
import { BookMarkIcon, EyeIcon, HeartIcon } from '@/assets'
import { Table } from '@/components'
import { Title } from '@/features/router'
import { explore } from '@/features/router/explore'
import { useStore } from '@/hooks'

import {
  selectWatchItem,
  selectWatchItemEpisodeTitle,
  selectWatchItemFilename,
  selectWatchItemFullTitle,
  selectWatchItemProfile,
  selectWatchItemQualities,
  selectWatchItemStateEpisode,
  selectWatchItemStateSeason,
  selectWatchItemStateTranslatorId,
  updateWatchItemProfile,
} from '../../watch.slice'
import { ActionButton } from './ActionButton'
import { Collection } from './Collection'
import { Description } from './Description'
import { DownloadMenu } from './DownloadMenu'
import { IMDbButton } from './IMDbButton'
import { IssuesMenu } from './IssuesMenu'
import { KinopoiskButton } from './KinopoiskButton'
import { Person } from './Person'
import { RateMenu } from './RateMenu'
import { ShareMenu } from './ShareMenu'

export interface WatchInfoProps {
  id: number
}

export function WatchInfo({ id }: WatchInfoProps) {
  const [dispatch, selector] = useStore()
  const item = selector((state) => selectWatchItem(state, id))
  const title = selector((state) => selectWatchItemFullTitle(state, id))
  const filename = selector((state) => selectWatchItemFilename(state, id))
  const episodeTitle = selector((state) => selectWatchItemEpisodeTitle(state, id))
  const qualities = selector((state) => selectWatchItemQualities(state, id))
  const translatorId = selector((state) => selectWatchItemStateTranslatorId(state, id))
  const season = selector((state) => selectWatchItemStateSeason(state, id))
  const episode = selector((state) => selectWatchItemStateEpisode(state, id))
  const profile = selector((state) => selectWatchItemProfile(state, id))
  const category = useMemo(() => ({ to: `/explore/${item.typeId}`, title: item.type }), [item])
  const [shareOpen, setShareOpen] = useState(false)
  const [favoriteDisabled, setFavoriteDisabled] = useState(false)
  const [savedDisabled, setSavedDisabled] = useState(false)
  const [watchedDisabled, setWatchedDisabled] = useState(false)
  const [ratingDisabled, setRatingDisabled] = useState(false)
  const genres = useMemo(
    () =>
      item.genreIds.map((genreId) => ({
        to: `/explore/${item.typeId}/${genreId}`,
        title: explore[item.typeId].genres[genreId],
      })),
    [item],
  )
  const year = useMemo(() => {
    if (!item.year) return null
    return { to: `/explore/year/${item.year}`, title: `${item.year}` }
  }, [item])
  const country = useMemo(() => {
    if (!item.country) return null
    return { to: `/explore/country/${item.country}`, title: item.country }
  }, [item])
  const links = useMemo(() => {
    const links = []
    links.push(category)
    if (genres.length > 0) links.push(...genres)
    if (country) links.push(country)
    if (year) links.push(year)
    return links
  }, [category, genres, country, year])
  const releaseDate = useMemo(() => {
    if (!item.releaseDate || !year) return null
    const indexOfYear = item.releaseDate.indexOf(year.title)
    if (indexOfYear === -1) return null
    const startStr = item.releaseDate.slice(0, indexOfYear)
    const title = item.releaseDate.slice(indexOfYear)
    let endStr = ''
    if (item.itemType === 'series' && item.episodesInfo.length > 0) {
      endStr += item.episodesInfo.length
      if (item.episodesInfo.length > 1) endStr += ' сезонов'
      else endStr += ' сезон'
    }
    return { startStr, endStr, year: { to: year.to, title } }
  }, [item, year])
  const persons = useMemo(() => [...item.actors, ...item.directors], [item])
  const collections = useMemo(() => [...item.bestOf, ...item.collections], [item])
  const itemLink = useMemo(() => {
    return `${window.location.origin}/watch/${item.typeId}/${item.genreId}/${item.slug}`
  }, [item])
  const shareLink = useMemo(() => {
    let query = `tr=${translatorId}`
    if (typeof season === 'number' && typeof episode === 'number') {
      query += `&s=${season}&e=${episode}`
    }
    return `${itemLink}?${query}`
  }, [itemLink, translatorId, season, episode])

  const toggleFavorite = useCallback(async () => {
    if (favoriteDisabled) return
    setFavoriteDisabled(true)
    await dispatch(updateWatchItemProfile({ id, favorite: !profile.favorite }))
    setFavoriteDisabled(false)
  }, [dispatch, id, profile, favoriteDisabled])

  const toggleSaved = useCallback(async () => {
    if (savedDisabled) return
    setSavedDisabled(true)
    await dispatch(updateWatchItemProfile({ id, saved: !profile.saved }))
    setSavedDisabled(false)
  }, [dispatch, id, profile, savedDisabled])

  const toggleWatched = useCallback(async () => {
    if (watchedDisabled) return
    setWatchedDisabled(true)
    await dispatch(updateWatchItemProfile({ id, watched: !profile.watched }))
    setWatchedDisabled(false)
  }, [dispatch, id, profile, watchedDisabled])

  const setRating = useCallback(
    async (rating: number | null) => {
      if (ratingDisabled) return
      if (profile.rating === rating) {
        if (!profile.rating) return
        if (!rating) return
        setShareOpen(true)
      }
      setRatingDisabled(true)
      await dispatch(updateWatchItemProfile({ id, rating }))
      setRatingDisabled(false)
    },
    [dispatch, id, profile, ratingDisabled],
  )

  return (
    <Fragment>
      <Title>{title}</Title>
      <section className='container mt-4'>
        <h1 className='font-bold text-xl'>{item.title}</h1>
        {episodeTitle && (
          <h2 className='font-medium text-md text-muted-foreground'>{episodeTitle}</h2>
        )}
      </section>
      <section className='w-full overflow-x-scroll space-x-2 flex items-center py-4 px-4 no-scrollbar sm:container'>
        <ActionButton Icon={HeartIcon} active={profile.favorite} onClick={toggleFavorite}>
          Favorite
        </ActionButton>
        <ActionButton Icon={BookMarkIcon} active={profile.saved} onClick={toggleSaved}>
          Watchlist
        </ActionButton>
        <ActionButton notFill Icon={EyeIcon} active={profile.watched} onClick={toggleWatched}>
          Watched
        </ActionButton>
        <RateMenu
          title={item.title}
          subtitle={item.year?.toString()}
          posterUrl={item.posterUrl || item.highResPosterUrl || 'null'}
          rating={profile.rating}
          onRateChange={setRating}
        />
        {item.kinopoiskRating && <KinopoiskButton rating={item.kinopoiskRating} />}
        {item.imdbRating && <IMDbButton rating={item.imdbRating} />}
        <ShareMenu
          open={shareOpen}
          id={id}
          itemTitle={item.title}
          itemLink={itemLink}
          title={title}
          link={shareLink}
          onOpenChange={setShareOpen}
        />
        <DownloadMenu filename={filename} qualities={qualities} />
        <IssuesMenu id={id} />
      </section>
      {item.description && (
        <section className='container'>
          <Description links={links}>{item.description}</Description>
        </section>
      )}
      {persons.length > 0 && (
        <section className='mt-8'>
          <div className='container'>
            <h3 className='font-bold text-lg'>Cast</h3>
          </div>
          <div
            className={cn(
              'mt-4 w-full overflow-x-scroll grid gap-2',
              'grid-flow-col no-scrollbar sm:px-8 px-4',
              'sm:container',
              persons.length >= 3 && 'grid-rows-3',
              persons.length === 2 && 'grid-rows-2',
              persons.length === 1 && 'grid-rows-1',
            )}
          >
            {persons.map((p) => (
              <Person key={p.id} person={p} />
            ))}
          </div>
        </section>
      )}
      {collections.length > 0 && (
        <section className='mt-8'>
          <div className='container'>
            <h3 className='font-bold text-lg'>Collections</h3>
          </div>
          <div
            className={cn(
              'mt-4 w-full overflow-x-scroll grid gap-4',
              'grid-flow-col no-scrollbar sm:px-8 px-4',
              'sm:container',
              collections.length >= 3 && 'grid-rows-3',
              collections.length === 2 && 'grid-rows-2',
              collections.length === 1 && 'grid-rows-1',
            )}
          >
            {collections.map((c) => (
              <Collection key={c.url} collection={c} />
            ))}
          </div>
        </section>
      )}
      <section className='container mt-8 mb-16'>
        <h3 className='font-bold text-lg'>About {item.itemType === 'series' ? 'show' : 'movie'}</h3>
        <Table.Root>
          {item.originalTitle && (
            <Table.Row>
              <Table.TitleCol>Original Title</Table.TitleCol>
              <Table.Col>{item.originalTitle}</Table.Col>
            </Table.Row>
          )}
          {item.lastInfo && (
            <Table.Row>
              <Table.TitleCol>Status</Table.TitleCol>
              <Table.Col>{item.lastInfo}</Table.Col>
            </Table.Row>
          )}
          {item.slogan && (
            <Table.Row>
              <Table.TitleCol>Slogan</Table.TitleCol>
              <Table.Col>{item.slogan}</Table.Col>
            </Table.Row>
          )}
          {releaseDate && (
            <Table.Row>
              <Table.TitleCol>Release Date</Table.TitleCol>
              <Table.Col>
                {releaseDate.startStr}
                <Table.Link to={releaseDate.year.to}>{releaseDate.year.title}</Table.Link>
                {releaseDate.endStr && (
                  <Fragment>
                    <br />
                    <span>{releaseDate.endStr}</span>
                  </Fragment>
                )}
              </Table.Col>
            </Table.Row>
          )}
          {country && (
            <Table.Row>
              <Table.TitleCol>Country Origin</Table.TitleCol>
              <Table.Col>
                <Table.Link to={country.to}>{country.title}</Table.Link>
              </Table.Col>
            </Table.Row>
          )}
          <Table.Row>
            <Table.TitleCol>Category</Table.TitleCol>
            <Table.Col>
              <Table.Link to={category.to}>{category.title}</Table.Link>
            </Table.Col>
          </Table.Row>
          {genres.length > 0 && (
            <Table.Row>
              <Table.TitleCol>Genres</Table.TitleCol>
              <Table.Col>
                {genres.map(({ to, title }, index) => (
                  <Fragment key={to}>
                    <Table.Link to={to}>{title}</Table.Link>
                    {index !== genres.length - 1 && ', '}
                  </Fragment>
                ))}
              </Table.Col>
            </Table.Row>
          )}
          {item.ageRating && (
            <Table.Row>
              <Table.TitleCol>Age Rating</Table.TitleCol>
              <Table.Col>{item.ageRating}</Table.Col>
            </Table.Row>
          )}
        </Table.Root>
      </section>
    </Fragment>
  )
}
