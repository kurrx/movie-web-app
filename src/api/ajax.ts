import axios from 'axios'

import { Request } from '@/core'
import {
  BaseItem,
  FetchItemArgs,
  FetchMovieStreamArgs,
  FetchSearchArgs,
  FetchSeriesEpisodesStreamArgs,
  FetchSeriesStreamArgs,
  Item,
  ItemMovie,
  ItemMovieStream,
  ItemSeries,
  ItemSeriesSeasonStream,
  ItemSeriesStream,
  ItemTranslator,
  SeriesEpisodesStreamResponse,
  Stream,
  StreamResponse,
  StreamSuccessResponse,
} from '@/types'

import { PROVIDER_URL, PROXY_URL } from './env'
import { convertDataToDom, parseProxiedCookies, sendProxiedCookies } from './interceptors'
import {
  parseItemDocument,
  parseItemDocumentEpisodes,
  parseSearchDocument,
  parseStream,
  parseStreamSeasons,
} from './parser'
import { bytesToStr } from './utils'

export const html = new Request({
  baseURL: `${PROXY_URL}/${PROVIDER_URL}`,
  responseType: 'document',
  responseEncoding: 'utf8',
})
  .useRequest(sendProxiedCookies)
  .useResponse(parseProxiedCookies)
  .useResponse(convertDataToDom)
  .construct()

export async function fetchSearch({ query, signal }: FetchSearchArgs) {
  // TODO: Add pagination support
  const params = { q: query, do: 'search', subaction: 'search' }
  const { data } = await html.get<Document>('/search/', { params, signal })
  return parseSearchDocument(data)
}

export async function fetchItemMovie(
  baseItem: BaseItem,
  translator: ItemTranslator,
  signal?: AbortSignal,
): Promise<ItemMovie> {
  const stream = await fetchMovieStream({
    id: baseItem.id,
    translatorId: translator.id,
    favsId: baseItem.favsId,
    isCamrip: translator.isCamrip,
    isAds: translator.isAds,
    isDirector: translator.isDirector,
    signal,
  })
  const streams: ItemMovieStream[] = baseItem.translators.map((t) => ({
    translatorId: t.id,
    stream: t.id === translator.id ? stream : null,
  }))
  return {
    ...baseItem,
    ogType: 'video.movie',
    itemType: 'movie',
    streams,
  }
}

export async function fetchItemSeries(
  baseItem: BaseItem,
  translator: ItemTranslator,
  document: Document,
  signal?: AbortSignal,
  season?: number,
  episode?: number,
): Promise<ItemSeries> {
  const episodesInfo = parseItemDocumentEpisodes(document)
  const { stream, seasons, streamFor } = await fetchSeriesEpisodesStream({
    id: baseItem.id,
    translatorId: translator.id,
    favsId: baseItem.favsId,
    season,
    episode,
    signal,
  })
  const streams: ItemSeriesStream[] = baseItem.translators.map((t) => {
    const translatorId = t.id
    let translatorSeasons: ItemSeriesSeasonStream[] | null = null
    if (translatorId === translator.id) {
      translatorSeasons = seasons.map((s) => ({
        number: s.number,
        title: s.title,
        episodes: s.episodes.map((e) => ({
          number: e.number,
          title: e.title,
          stream: s.number === streamFor.season && e.number === streamFor.episode ? stream : null,
        })),
      }))
    }
    return { translatorId, seasons: translatorSeasons }
  })
  return {
    ...baseItem,
    ogType: 'video.tv_series',
    itemType: 'series',
    episodesInfo,
    streams,
  }
}

export async function fetchItem(args: FetchItemArgs): Promise<Item> {
  const { signal, fullId, translatorId, season, episode } = args
  const uri = `/${fullId.typeId}/${fullId.genreId}/${fullId.slug}.html`
  const { data } = await html.get<Document>(uri, { signal })
  const baseItem = parseItemDocument(data, fullId)
  const translator =
    baseItem.translators.find((t) => t.id === translatorId) || baseItem.translators[0]
  if (baseItem.ogType === 'video.movie') {
    return await fetchItemMovie(baseItem, translator, signal)
  } else {
    return await fetchItemSeries(baseItem, translator, data, signal, season, episode)
  }
}

export const ajax = new Request({
  baseURL: `${PROXY_URL}/${PROVIDER_URL}`,
  responseType: 'json',
  responseEncoding: 'utf8',
})
  .useRequest(sendProxiedCookies)
  .useResponse(parseProxiedCookies)
  .construct()

export async function fetchStreamDownloadSize(stream: Stream, id: string) {
  const quality = stream.qualities.find((q) => q.id === id)
  if (!quality) return
  const res = await axios.head(quality.downloadUrl)
  const size = Number(res.headers['Content-Length'] || res.headers['content-length'] || '0')
  quality.downloadSize = size
  quality.downloadSizeStr = bytesToStr(size)
}

export async function fetchStreamThumbnails(stream: Stream) {
  const { data } = await ajax.get<string>(stream.thumbnailsUrl)
  stream.thumbnails.parse(data)
}

export async function fetchStream(args: StreamSuccessResponse) {
  const stream = parseStream(args)
  const promises = stream.qualities.map((q) => fetchStreamDownloadSize(stream, q.id))
  promises.push(fetchStreamThumbnails(stream))
  await Promise.all(promises)
  return stream
}

export async function fetchMovieStream(args: FetchMovieStreamArgs) {
  const { id, translatorId, favsId, isCamrip, isAds, isDirector, signal } = args
  const params = new URLSearchParams({
    id: String(id),
    translator_id: String(translatorId),
    favs: favsId,
    is_camrip: String(Number(isCamrip)),
    is_ads: String(Number(isAds)),
    is_director: String(Number(isDirector)),
    action: 'get_movie',
  })
  const { data } = await ajax.post<StreamResponse>(
    `/ajax/get_cdn_series/?t=${Date.now()}`,
    params,
    { signal },
  )
  if (!data.success)
    throw new Error(data.message || 'Unable to get movie stream details. Try again later.')
  return await fetchStream(data)
}

export async function fetchSeriesStream(args: FetchSeriesStreamArgs) {
  const { id, translatorId, favsId, season, episode, signal } = args
  const params = new URLSearchParams({
    id: String(id),
    translator_id: String(translatorId),
    favs: favsId,
    season: String(season),
    episode: String(episode),
    action: 'get_stream',
  })
  const { data } = await ajax.post<StreamResponse>(
    `/ajax/get_cdn_series/?t=${Date.now()}`,
    params,
    { signal },
  )
  if (!data.success)
    throw new Error(data.message || 'Unable to get episode stream details. Try again later.')
  return await fetchStream(data)
}

export async function fetchSeriesEpisodesStream(args: FetchSeriesEpisodesStreamArgs) {
  const { id, translatorId, favsId, season, episode, signal } = args
  const params = new URLSearchParams({
    id: String(id),
    translator_id: String(translatorId),
    favs: favsId,
    action: 'get_episodes',
  })
  if (typeof season === 'number') params.append('season', String(season))
  if (typeof episode === 'number') params.append('episode', String(episode))
  const { data } = await ajax.post<SeriesEpisodesStreamResponse>(
    `/ajax/get_cdn_series/?t=${Date.now()}`,
    params,
    { signal },
  )
  if (!data.success)
    throw new Error(data.message || 'Unable to get episodes list. Try again later.')
  const seasons = parseStreamSeasons(data.seasons, data.episodes)
  const stream = await fetchStream(data)
  return {
    seasons,
    stream,
    streamFor: {
      season: season || seasons[0].number,
      episode: episode || seasons[0].episodes[0].number,
    },
  }
}
