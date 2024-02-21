import { Request } from '@/core'
import {
  FetchExploreArgs,
  FetchItemArgs,
  FetchItemMovieArgs,
  FetchItemSeriesArgs,
  FetchMovieStreamArgs,
  FetchMovieTranslatorArgs,
  FetchPersonArgs,
  FetchSearchArgs,
  FetchSeriesEpisodesStreamArgs,
  FetchSeriesStreamArgs,
  FetchSeriesTranslatorArgs,
  FetchSeriesTranslatorResponse,
  FetchStreamDetailsArgs,
  FetchStreamDownloadSizeArgs,
  FetchStreamThumbnailArgs,
  FetchTranslatorArgs,
  Item,
  ItemMovie,
  ItemMovieStream,
  ItemSeries,
  ItemSeriesEpisodeStream,
  ItemSeriesSeasonStream,
  ItemSeriesStream,
  SeriesEpisodesStreamResponse,
  StreamResponse,
} from '@/types'

import { db } from './database'
import { PROVIDER_URL, PROXY_URL } from './env'
import {
  convertDataToDom,
  parseProxiedCookies,
  sendProxiedCookies,
  sendProxiedUserAgent,
} from './interceptors'
import {
  parseCollectionsDocument,
  parseExploreDocument,
  parseItemDocument,
  parseItemDocumentEpisodes,
  parsePersonDocument,
  parseSearchDocument,
  parseStream,
  parseStreamSeasons,
} from './parser'
import { bytesToStr } from './utils'

export const html = new Request({
  baseURL: `${PROXY_URL}/${PROVIDER_URL}`,
  responseType: 'document',
  responseEncoding: 'utf8',
  timeout: 10_000,
  headers: {
    'x-proxy-origin': PROVIDER_URL,
    'x-proxy-referer': PROVIDER_URL + '/',
  },
})
  .useRequest(sendProxiedCookies)
  .useRequest(sendProxiedUserAgent)
  .useResponse(parseProxiedCookies)
  .useResponse(convertDataToDom)
  .construct()

export async function fetchSearch(args: FetchSearchArgs, retry = 0) {
  try {
    const { query, signal } = args
    const params = { q: query, do: 'search', subaction: 'search' }
    const { data } = await html.get<Document>('/search/', { params, signal })
    return parseSearchDocument(data)
  } catch (err) {
    if (retry < 3) return await fetchSearch(args, retry + 1)
    throw err
  }
}

export async function fetchExplore(args: FetchExploreArgs, retry = 0) {
  try {
    const { url, signal } = args
    const { data } = await html.get<Document>(url, { signal })
    return parseExploreDocument(data)
  } catch (err) {
    if (retry < 3) return await fetchExplore(args, retry + 1)
    throw err
  }
}

export async function fetchPerson(args: FetchPersonArgs, retry = 0) {
  try {
    const { id, signal } = args
    const { data } = await html.get<Document>(`/person/${id}/`, { signal })
    return parsePersonDocument(data)
  } catch (err) {
    if (retry < 3) return await fetchPerson(args, retry + 1)
    throw err
  }
}

export async function fetchCollections(args: FetchExploreArgs, retry = 0) {
  try {
    const { url, signal } = args
    const { data } = await html.get<Document>(url, { signal })
    return parseCollectionsDocument(data)
  } catch (err) {
    if (retry < 3) return await fetchCollections(args, retry + 1)
    throw err
  }
}

export async function fetchItemMovie(args: FetchItemMovieArgs, retry = 0): Promise<ItemMovie> {
  try {
    const { baseItem, translator, signal, referer } = args
    const stream = await fetchMovieStream({
      id: baseItem.id,
      translatorId: translator.id,
      favsId: baseItem.favsId,
      isCamrip: translator.isCamrip,
      isAds: translator.isAds,
      isDirector: translator.isDirector,
      signal,
      referer,
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
  } catch (err) {
    if (retry < 3) return await fetchItemMovie(args, retry + 1)
    throw err
  }
}

export async function fetchItemSeries(args: FetchItemSeriesArgs, retry = 0): Promise<ItemSeries> {
  try {
    const { baseItem, translator, document, signal, season, episode, referer } = args
    const episodesInfo = parseItemDocumentEpisodes(document)
    const { stream, seasons, streamFor } = await fetchSeriesEpisodesStream({
      id: baseItem.id,
      translatorId: translator.id,
      favsId: baseItem.favsId,
      season,
      episode,
      signal,
      referer,
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
  } catch (err) {
    if (retry < 3) return await fetchItemSeries(args, retry + 1)
    throw err
  }
}

export async function fetchItem(args: FetchItemArgs, retry = 0): Promise<Item> {
  try {
    const { signal, fullId, translatorId, season, episode, referer } = args
    const data = await db.getItem(fullId.id, async () => {
      const uri = `/${fullId.typeId}/${fullId.genreId}/${fullId.slug}.html`
      const { data } = await html.get<Document>(uri, { signal })
      return data
    })
    const baseItem = parseItemDocument(data, fullId)
    const translator =
      baseItem.translators.find((t) => t.id === translatorId) || baseItem.translators[0]
    if (baseItem.ogType === 'video.movie') {
      return await fetchItemMovie({ baseItem, translator, signal, referer })
    } else {
      return await fetchItemSeries({
        baseItem,
        translator,
        document: data,
        signal,
        season,
        episode,
        referer,
      })
    }
  } catch (err) {
    if (retry < 3) return await fetchItem(args, retry + 1)
    throw err
  }
}

export const ajax = new Request({
  baseURL: `${PROXY_URL}/${PROVIDER_URL}`,
  responseType: 'json',
  responseEncoding: 'utf8',
  timeout: 10_000,
  headers: {
    'x-proxy-origin': PROVIDER_URL,
  },
})
  .useRequest(sendProxiedCookies)
  .useRequest(sendProxiedUserAgent)
  .useResponse(parseProxiedCookies)
  .construct()

export const cdn = new Request({
  baseURL: PROXY_URL,
  timeout: 10_000,
  headers: {
    'x-proxy-origin': PROVIDER_URL,
    'x-proxy-referer': PROVIDER_URL + '/',
  },
})
  .useRequest(sendProxiedUserAgent)
  .construct()

export async function fetchStreamDownloadSize(args: FetchStreamDownloadSizeArgs, retry = 0) {
  const { qualityId, downloadUrl, signal } = args
  try {
    const size = await db.getSize(args, async () => {
      const res = await cdn.head(downloadUrl, { signal })
      const size = Number(res.headers['Content-Length'] || res.headers['content-length'] || '0')
      return size
    })
    return { id: qualityId, downloadSize: size, downloadSizeStr: bytesToStr(size) }
  } catch (err) {
    if (retry < 3) return await fetchStreamDownloadSize(args, retry + 1)
    return { id: qualityId, downloadSize: 0, downloadSizeStr: bytesToStr(0) }
  }
}

export async function fetchStreamThumbnails(args: FetchStreamThumbnailArgs, retry = 0) {
  try {
    const { stream, signal, referer } = args
    const data = await db.getThumbnails(args, async () => {
      const { data } = await ajax.get<string>(stream.thumbnailsUrl, {
        signal,
        headers: { 'x-proxy-referer': referer },
      })
      return data
    })
    return data
  } catch (err) {
    if (retry < 3) return await fetchStreamThumbnails(args, retry + 1)
    throw err
  }
}

export async function fetchStreamDetails(args: FetchStreamDetailsArgs, retry = 0) {
  try {
    const { stream, referer } = args
    const thumbnailsPromise = fetchStreamThumbnails(args)
    const promises = stream.qualities.map((q) =>
      fetchStreamDownloadSize({ ...args, qualityId: q.id, downloadUrl: q.downloadUrl, referer }),
    )
    const [sizes, thumbnails] = await Promise.all([Promise.all(promises), thumbnailsPromise])
    return { thumbnails, sizes }
  } catch (err) {
    if (retry < 3) return await fetchStreamDetails(args, retry + 1)
    throw err
  }
}

export async function fetchMovieStream(args: FetchMovieStreamArgs, retry = 0) {
  try {
    const { id, translatorId, favsId, isCamrip, isAds, isDirector, signal, referer } = args
    const data = await db.getMovie(args, async () => {
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
        { signal, headers: { 'x-proxy-referer': referer } },
      )
      if (!data.success)
        throw new Error(data.message || 'Unable to get movie stream details. Try again later.')
      return data
    })
    return parseStream(data)
  } catch (err) {
    if (retry < 3) return await fetchMovieStream(args, retry + 1)
    throw err
  }
}

export async function fetchSeriesStream(args: FetchSeriesStreamArgs, retry = 0) {
  try {
    const { id, translatorId, favsId, season, episode, signal, referer } = args
    const data = await db.getSeries(args, async () => {
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
        { signal, headers: { 'x-proxy-referer': referer } },
      )
      if (!data.success)
        throw new Error(data.message || 'Unable to get episode stream details. Try again later.')
      return data
    })
    return parseStream(data)
  } catch (err) {
    if (retry < 3) return await fetchSeriesStream(args, retry + 1)
    throw err
  }
}

export async function fetchSeriesEpisodesStream(args: FetchSeriesEpisodesStreamArgs, retry = 0) {
  try {
    const { id, translatorId, favsId, season, episode, signal, referer } = args
    const seasons = await db.getSeasons(args, async () => {
      const params = new URLSearchParams({
        id: String(id),
        translator_id: String(translatorId),
        favs: favsId,
        action: 'get_episodes',
      })
      const { data } = await ajax.post<SeriesEpisodesStreamResponse>(
        `/ajax/get_cdn_series/?t=${Date.now()}`,
        params,
        { signal, headers: { 'x-proxy-referer': referer } },
      )
      if (!data.success)
        throw new Error(data.message || 'Unable to get episodes list. Try again later.')
      const seasons = parseStreamSeasons(data.seasons, data.episodes)
      await db.addSeries(
        {
          id,
          translatorId,
          favsId,
          season: seasons[0].number,
          episode: seasons[0].episodes[0].number,
        },
        {
          message: data.message,
          success: true,
          thumbnails: data.thumbnails,
          url: data.url,
          subtitle: data.subtitle,
          subtitle_def: data.subtitle_def,
          subtitle_lns: data.subtitle_lns,
          quality: data.quality,
        },
      )
      return seasons
    })
    const streamFor = {
      season: seasons[0].number,
      episode: seasons[0].episodes[0].number,
    }
    if (season && episode) {
      const foundSeason = seasons.find((s) => s.number === season)
      if (foundSeason) {
        const foundEpisode = foundSeason.episodes.find((e) => e.number === episode)
        if (foundEpisode) {
          streamFor.season = season
          streamFor.episode = episode
        }
      }
    }
    const stream = await fetchSeriesStream({
      id,
      translatorId,
      favsId,
      signal,
      referer,
      ...streamFor,
    })
    return {
      seasons,
      stream,
      streamFor,
    }
  } catch (err) {
    if (retry < 3) return await fetchSeriesEpisodesStream(args, retry + 1)
    throw err
  }
}

export async function fetchMovieTranslator(args: FetchMovieTranslatorArgs, retry = 0) {
  try {
    const { item, translatorId, signal, referer } = args
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
      referer,
    })
    return { type: 'movie' as const, stream }
  } catch (err) {
    if (retry < 3) return await fetchMovieTranslator(args, retry + 1)
    throw err
  }
}

export async function fetchSeriesTranslator(args: FetchSeriesTranslatorArgs, retry = 0) {
  try {
    const { item, translatorId, state, signal, referer } = args
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
        referer,
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
        referer,
      })
      next = { stream, streamFor: stateTo }
    }
    return {
      type: 'series' as const,
      stateTo,
      initial,
      next,
    }
  } catch (err) {
    if (retry < 3) return await fetchSeriesTranslator(args, retry + 1)
    throw err
  }
}

export async function fetchTranslator(args: FetchTranslatorArgs, retry = 0) {
  try {
    const { item, translatorId, state, signal, referer } = args
    if (item.itemType === 'series') {
      return await fetchSeriesTranslator({ item, translatorId, signal, state, referer })
    } else {
      return await fetchMovieTranslator({ item, translatorId, signal, referer })
    }
  } catch (err) {
    if (retry < 3) return await fetchTranslator(args, retry + 1)
    throw err
  }
}
