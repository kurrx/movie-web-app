import { Fragment, useCallback, useMemo, useState } from 'react'

import { BookMarkIcon, EyeIcon, HeartIcon, ShareIcon } from '@/assets'
import { Title } from '@/features/router'
import { explore } from '@/features/router/explore'
import { useAppSelector } from '@/hooks'

import {
  selectWatchItem,
  selectWatchItemEpisodeTitle,
  selectWatchItemFullTitle,
  selectWatchItemQualities,
} from '../../watch.slice'
import { ActionButton } from './ActionButton'
import { Description } from './Description'
import { DownloadMenu } from './DownloadMenu'
import { Table } from './Table'

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
  const category = useMemo(() => ({ to: `/explore/${item.typeId}`, title: item.type }), [item])
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
        <ActionButton disabled Icon={HeartIcon} active={favorite} onClick={toggleFavorite}>
          {favorite ? 'Remove' : 'Favorite'}
        </ActionButton>
        <ActionButton disabled Icon={BookMarkIcon} active={saved} onClick={toggleSaved}>
          {saved ? 'Saved' : 'Save'}
        </ActionButton>
        <ActionButton disabled notFill Icon={EyeIcon} active={watched} onClick={toggleWatched}>
          Watched
        </ActionButton>
        <ActionButton disabled Icon={ShareIcon}>
          Share
        </ActionButton>
        <DownloadMenu title={title} qualities={qualities} />
      </div>
      <div className='container mb-16'>
        {item.description && <Description links={links}>{item.description}</Description>}
        <section className='mt-8'>
          <h3 className='font-bold text-lg'>
            More about this {item.itemType === 'series' ? 'show' : 'movie'}
          </h3>
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
      </div>
    </Fragment>
  )
}
