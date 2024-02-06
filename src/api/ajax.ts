import axios from 'axios'
import axiosRetry from 'axios-retry'

import { Request } from '@/core'
import {
  FetchItemArgs,
  FetchItemMovieArgs,
  FetchItemSeriesArgs,
  FetchMovieStreamArgs,
  FetchMovieTranslatorArgs,
  FetchSearchArgs,
  FetchSeriesEpisodesStreamArgs,
  FetchSeriesStreamArgs,
  FetchSeriesTranslatorArgs,
  FetchSeriesTranslatorResponse,
  FetchTranslatorArgs,
  FetchTranslatorResponse,
  Item,
  ItemMovie,
  ItemMovieStream,
  ItemSeries,
  ItemSeriesEpisodeStream,
  ItemSeriesSeasonStream,
  ItemSeriesStream,
  SeriesEpisodesStreamResponse,
  Stream,
  StreamResponse,
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

const retryConfig = {
  retries: 5,
  retryDelay: () => 500,
  retryCondition: () => true,
}

export const html = new Request({
  baseURL: `${PROXY_URL}/${PROVIDER_URL}`,
  responseType: 'document',
  responseEncoding: 'utf8',
  timeout: 7000,
})
  .useRequest(sendProxiedCookies)
  .useResponse(parseProxiedCookies)
  .useResponse(convertDataToDom)
  .construct()
axiosRetry(html, retryConfig)

export async function fetchSearch({ query, signal }: FetchSearchArgs) {
  // TODO: Add pagination support
  const params = { q: query, do: 'search', subaction: 'search' }
  const { data } = await html.get<Document>('/search/', { params, signal })
  return parseSearchDocument(data)
}

export async function fetchItemMovie(args: FetchItemMovieArgs): Promise<ItemMovie> {
  const { baseItem, translator, signal } = args
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

export async function fetchItemSeries(args: FetchItemSeriesArgs): Promise<ItemSeries> {
  const { baseItem, translator, document, signal, season, episode } = args
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
    return await fetchItemMovie({ baseItem, translator, signal })
  } else {
    return await fetchItemSeries({
      baseItem,
      translator,
      document: data,
      signal,
      season,
      episode,
    })
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
axiosRetry(ajax, retryConfig)

export async function fetchStreamDownloadSize(stream: Stream, id: string, signal?: AbortSignal) {
  const quality = stream.qualities.find((q) => q.id === id)!
  const res = await axios.head(quality.downloadUrl, { signal })
  const size = Number(res.headers['Content-Length'] || res.headers['content-length'] || '0')
  return { id, downloadSize: size, downloadSizeStr: bytesToStr(size) }
}

export async function fetchStreamThumbnails(stream: Stream, signal?: AbortSignal) {
  const { data } = await ajax.get<string>(stream.thumbnailsUrl, { signal })
  return data
}

export async function fetchStreamDetails(stream: Stream, signal?: AbortSignal) {
  const thumbnailsPromise = fetchStreamThumbnails(stream, signal)
  const promises = stream.qualities.map((q) => fetchStreamDownloadSize(stream, q.id, signal))
  const [sizes, thumbnails] = await Promise.all([Promise.all(promises), thumbnailsPromise])
  return { thumbnails, sizes }
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
  return parseStream(data)
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
  return parseStream(data)
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
  const stream = parseStream(data)
  return {
    seasons,
    stream,
    streamFor: {
      season: season || seasons[0].number,
      episode: episode || seasons[0].episodes[0].number,
    },
  }
}

export async function fetchMovieTranslator(args: FetchMovieTranslatorArgs) {
  const { item, translatorId, signal } = args
  const foundStream = item.streams.find((s) => s.translatorId === translatorId)!.stream
  if (foundStream) return { type: 'movie' as const }
  const translator = item.translators.find((t) => t.id === translatorId)!
  const stream = await fetchMovieStream({
    id: item.id,
    favsId: item.favsId,
    translatorId,
    isCamrip: translator.isCamrip,
    isAds: translator.isAds,
    isDirector: translator.isDirector,
    signal,
  })
  return { type: 'movie' as const, stream }
}

export async function fetchSeriesTranslator(args: FetchSeriesTranslatorArgs) {
  const { item, translatorId, state, signal } = args
  const stateTo = { season: state.season!, episode: state.episode! }
  let initial: FetchSeriesTranslatorResponse['initial']
  let seasons = item.streams.find((s) => s.translatorId === translatorId)!.seasons!
  if (!seasons) {
    // Translator not fetched yet
    const res = await fetchSeriesEpisodesStream({
      id: item.id,
      translatorId,
      favsId: item.favsId,
      signal,
    })
    const { seasons: newSeasons, stream, streamFor } = res
    seasons = newSeasons.map((s) => ({
      number: s.number,
      title: s.title,
      episodes: s.episodes.map((e) => ({
        number: e.number,
        title: e.title,
        stream: s.number === streamFor.season && e.number === streamFor.episode ? stream : null,
      })),
    }))
    initial = seasons
  }
  let season = seasons.find((s) => s.number === stateTo.season)
  let episode: ItemSeriesEpisodeStream | undefined
  if (!season) {
    // Season doesn't exists on this translator,
    // reset to first available season
    season = seasons[0]
    stateTo.season = season.number
    // and episode
    episode = season.episodes[0]
    stateTo.episode = episode.number
  } else {
    // Season exists, search for episode
    episode = season.episodes.find((e) => e.number === stateTo.episode)
  }
  if (!episode) {
    // Episode doesn't exists on this translator,
    // reset to first available episode
    episode = season.episodes[0]
    stateTo.episode = episode.number
  }
  let next: FetchSeriesTranslatorResponse['next']
  if (!episode.stream) {
    // Stream not fetched yet, start fetching
    const stream = await fetchSeriesStream({
      id: item.id,
      translatorId,
      favsId: item.favsId,
      season: stateTo.season,
      episode: stateTo.episode,
      signal,
    })
    next = { stream, streamFor: stateTo }
  }
  return {
    type: 'series' as const,
    stateTo,
    initial,
    next,
  }
}

export async function fetchTranslator(args: FetchTranslatorArgs): Promise<FetchTranslatorResponse> {
  const { item, translatorId, state, signal } = args
  if (item.itemType === 'series') {
    return await fetchSeriesTranslator({ item, translatorId, signal, state })
  } else {
    return await fetchMovieTranslator({ item, translatorId, signal })
  }
}
