import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'

import {
  fetchItem,
  fetchSeriesStream,
  fetchStreamDetails,
  fetchTranslator,
  getItemState,
  getProfileItem,
  refererFromId,
  saveItemState,
  saveLastItem,
  transliterate,
  updateItemState,
  updateProfileItem,
} from '@/api'
import { FetchState, SwitchState, ThumbnailSegment } from '@/core'
import {
  AppStoreState,
  ItemFullID,
  ItemMovie,
  ItemSeries,
  LastItemState,
  Stream,
  ThunkApiConfig,
  UpdateItemStateArgs,
  UpdateProfileItemArgs,
  WatchItemState,
  WatchPlaylist,
  WatchPlaylistItem,
  WatchPlaylistItemFranchise,
  WatchPlaylistItemSeason,
  WatchPlaylistPlayItem,
  WatchProfileItem,
  WatchStoreState,
} from '@/types'

import { setProfileUser } from '../profile'

type Thunk = ThunkApiConfig
type ThunkApi = { getState: () => AppStoreState }
type UpdateReturn<T> = { uid: string; result: T }
type UpdateParam = { id: number }
type GetItemReturn = {
  uid: string
  item: Awaited<ReturnType<typeof fetchItem>>
  itemState: WatchItemState
  needToSave: boolean
  profile: WatchProfileItem
}
type GetItemParam = { fullId: ItemFullID; nextState?: WatchItemState | null }
type GetStreamReturn = Awaited<ReturnType<typeof fetchStreamDetails>>
type GetStreamParam = number
type SEpisodeReturn = UpdateReturn<Awaited<ReturnType<typeof fetchSeriesStream>> | null>
type SEpisodeParam = { season: number; episode: number } & UpdateParam
type STranslatorReturn = UpdateReturn<Awaited<ReturnType<typeof fetchTranslator>>>
type STranslatorParam = { translatorId: number } & UpdateParam
type SQualityReturn = UpdateReturn<null>
type SQualityParam = { quality: string } & UpdateParam
type SwitchAction = { meta: { arg: { id: number }; requestId: string } }
type UTimeParam = {
  time: number
  duration: number
  subtitle: string
  thumbnails: ThumbnailSegment
  update: boolean
} & UpdateParam
type UTimeReturn = UpdateReturn<LastItemState>
type USubtitleParam = { subtitle: string | null } & UpdateParam
type USubtitleReturn = UpdateReturn<null>
type UProfileParam = UpdateProfileItemArgs & UpdateParam

function switchPending(state: WatchStoreState, action: SwitchAction) {
  const switchState = state.switchStates.find((s) => s.id === action.meta.arg.id)!
  switchState.state = SwitchState.LOADING
  switchState.error = null
  switchState.requestId = action.meta.requestId
}
function switchRejected(type: 'episode' | 'translator' | 'quality') {
  const error = {
    code: 'Switch Error',
    name: 'Switch Error',
    message: `Error while changing ${type}! Try again.`,
  }
  return function (state: WatchStoreState, action: SwitchAction) {
    const switchState = state.switchStates.find((s) => s.requestId === action.meta.requestId)
    if (switchState && switchState.state === SwitchState.LOADING) {
      switchState.requestId = null
      switchState.state = SwitchState.ERROR
      switchState.error = error
    }
  }
}
function checkState(stream: Stream, state: WatchItemState, update?: UpdateItemStateArgs) {
  const isQualityPresent = stream.qualities.some((q) => q.id === state.quality)
  if (!isQualityPresent) {
    if (update) {
      update.quality = stream.defaultQuality
    }
    state.quality = stream.defaultQuality
  }
  const isSubtitlePresent = stream.subtitles.some((s) => s.id === state.subtitle)
  if (!isSubtitlePresent) {
    if (update) {
      update.subtitle = stream.defaultSubtitle
    }
    state.subtitle = stream.defaultSubtitle
  }
}
function getItemStream(state: WatchStoreState, id: number) {
  const item = state.items.find((i) => i.id === id)!.item!
  const itemState = state.states[id]!
  const translatorId = itemState.translatorId
  let stream: Stream
  if (item.itemType === 'series') {
    const season = itemState.season!
    const episode = itemState.episode!
    stream = item.streams
      .find((s) => s.translatorId === translatorId)!
      .seasons!.find((s) => s.number === season)!
      .episodes.find((e) => e.number === episode)!.stream!
  } else {
    stream = item.streams.find((s) => s.translatorId === translatorId)!.stream!
  }
  return stream
}

const initialState: WatchStoreState = {
  items: [],
  states: {},
  switchStates: [],
}

const blankAsync = async (_: unknown, { getState }: ThunkApi) => ({
  uid: getState().profile.user!.uid,
  result: null,
})

export const getItem = createAsyncThunk<GetItemReturn, GetItemParam, Thunk>(
  'watch/getItem',
  async ({ fullId, nextState }, { signal, getState }) => {
    const uid = getState().profile.user!.uid
    let itemState: WatchItemState | null | undefined = getState().watch.states[fullId.id]
    let needToSave = false
    if (!itemState) {
      const firestoreState = await getItemState(uid, fullId.id)
      itemState = firestoreState.state
      needToSave = !firestoreState.exists
      if (nextState) {
        needToSave = true
        if (itemState) {
          itemState.translatorId = nextState.translatorId
          itemState.timestamp = nextState.timestamp
          itemState.season = nextState.season
          itemState.episode = nextState.episode
        } else {
          itemState = nextState
        }
      }
    }
    const item = await fetchItem({
      fullId,
      translatorId: itemState?.translatorId,
      season: itemState?.season,
      episode: itemState?.episode,
      signal,
      referer: refererFromId(fullId),
    })
    const profile = await getProfileItem(uid, fullId.id, item)
    if (!itemState) {
      itemState = {
        translatorId: item.translators[0].id,
        timestamp: 0,
        quality: 'auto',
        subtitle: 'null',
      }
    }
    const translator =
      item.translators.find((t) => t.id === itemState?.translatorId) || item.translators[0]
    itemState.translatorId = translator.id
    return { uid, item, itemState, needToSave, profile }
  },
  {
    condition(arg, api) {
      const items = api.getState().watch.items
      const findItem = items.find((i) => i.id === arg.fullId.id)
      if (!findItem) return true
      return findItem.state !== FetchState.SUCCESS
    },
  },
)
export const getStreamDetails = createAsyncThunk<GetStreamReturn, GetStreamParam, Thunk>(
  'watch/getStreamDetails',
  async (id, { signal, getState }) => {
    const item = getState().watch.items.find((i) => i.id === id)!.item!
    const stream = getItemStream(getState().watch, id)
    const itemState = getState().watch.states[id]!
    return await fetchStreamDetails({
      id,
      translatorId: itemState.translatorId,
      season: itemState.season,
      episode: itemState.episode,
      stream,
      signal,
      referer: refererFromId(item),
    })
  },
  {
    condition(id, { getState }) {
      const stream = getItemStream(getState().watch, id)
      return !stream.detailsFetched
    },
  },
)

const switchOptions = {
  condition({ id }: UpdateParam, { getState }: ThunkApi): boolean {
    const switchStates = getState().watch.switchStates
    const switchState = switchStates.find((s) => s.id === id)!
    return switchState.state !== SwitchState.LOADING
  },
}
export const switchEpisode = createAsyncThunk<SEpisodeReturn, SEpisodeParam, Thunk>(
  'watch/switchEpisode',
  async ({ id, season, episode }, { signal, getState }) => {
    const uid = getState().profile.user!.uid
    const item = getState().watch.items.find((i) => i.id === id)!.item! as ItemSeries
    const state = getState().watch.states[id]!
    const stream = item.streams
      .find((s) => s.translatorId === state.translatorId)!
      .seasons!.find((s) => s.number === season)!
      .episodes.find((e) => e.number === episode)!.stream
    if (stream) return { uid, result: null }
    const result = await fetchSeriesStream({
      id,
      favsId: item.favsId,
      translatorId: state.translatorId,
      season,
      episode,
      signal,
      referer: refererFromId(item),
    })
    return { uid, result }
  },
  switchOptions,
)
export const switchTranslator = createAsyncThunk<STranslatorReturn, STranslatorParam, Thunk>(
  'watch/switchTranslator',
  async ({ id, translatorId }, { signal, getState }) => {
    const uid = getState().profile.user!.uid
    const item = getState().watch.items.find((i) => i.id === id)!.item!
    const state = getState().watch.states[id]!
    const result = await fetchTranslator({
      item,
      translatorId,
      state,
      signal,
      referer: refererFromId(item),
    })
    return { uid, result }
  },
  switchOptions,
)
export const switchQuality = createAsyncThunk<SQualityReturn, SQualityParam, Thunk>(
  'watch/switchQuality',
  blankAsync,
  switchOptions,
)
export const preloadNextEpisode = createAsyncThunk<void, SEpisodeParam, Thunk>(
  'watch/preloadNextEpisode',
  async ({ id, season, episode }, { getState, signal }) => {
    const item = getState().watch.items.find((i) => i.id === id)!.item! as ItemSeries
    const state = getState().watch.states[id]!
    const nextEpisode = item.streams
      .find((s) => s.translatorId === state.translatorId)
      ?.seasons?.find((s) => s.number === season)
      ?.episodes?.find((e) => e.number === episode)
    if (nextEpisode) {
      const stream = nextEpisode.stream
      if (!stream) {
        const stream = await fetchSeriesStream({
          id,
          favsId: item.favsId,
          translatorId: state.translatorId,
          season,
          episode,
          signal,
          referer: refererFromId(item),
        })
        await fetchStreamDetails({
          id,
          translatorId: state.translatorId,
          season,
          episode,
          stream,
          signal,
          referer: refererFromId(item),
        })
      }
    }
  },
)

export const updateTime = createAsyncThunk<UTimeReturn, UTimeParam, Thunk>(
  'watch/updateTime',
  async ({ id, time, duration, subtitle, thumbnails, update }, { getState }) => {
    const state = getState().watch
    const item = state.items.find((i) => i.id === id)!.item!
    const uid = getState().profile.user!.uid
    const last = {
      id,
      title: item.title,
      subtitle,
      url: `/${item.typeId}/${item.genreId}/${item.slug}`,
      thumbnails,
      progress: time,
      duration,
    }
    if (update) {
      await saveLastItem(uid, last)
    }
    return {
      uid,
      result: last,
    }
  },
)
export const setSubtitle = createAsyncThunk<USubtitleReturn, USubtitleParam, Thunk>(
  'watch/setSubtitle',
  blankAsync,
)

export const updateWatchItemProfile = createAsyncThunk<void, UProfileParam, Thunk>(
  'watch/updateWatchItemProfile',
  async (args, { getState }) => {
    const uid = getState().profile.user!.uid
    const item = getState().watch.items.find((i) => i.id === args.id)!.item!
    return await updateProfileItem(uid, args.id, item, args)
  },
)

const watchSlice = createSlice({
  name: 'watch',
  initialState,

  reducers: {},

  extraReducers(builder) {
    builder
      .addCase(getItem.pending, (state, action) => {
        const item = state.items.find((i) => i.id === action.meta.arg.fullId.id)
        if (!item) {
          state.items.push({
            id: action.meta.arg.fullId.id,
            state: FetchState.LOADING,
            error: null,
            requestId: action.meta.requestId,
            item: null,
            profile: null,
          })
          state.switchStates.push({
            id: action.meta.arg.fullId.id,
            state: SwitchState.IDLE,
            error: null,
            requestId: null,
          })
        } else {
          item.state = FetchState.LOADING
          item.error = null
          item.requestId = action.meta.requestId
          item.item = null
          item.profile = null
        }
      })
      .addCase(getItem.fulfilled, (state, action) => {
        const item = state.items.find((i) => i.requestId === action.meta.requestId)
        if (item && item.state === FetchState.LOADING) {
          const fetchedItem = action.payload.item
          const profileItem = action.payload.profile
          const nextState = action.payload.itemState
          const uid = action.payload.uid
          const needToSave = action.payload.needToSave
          let stream: Stream
          if (fetchedItem.itemType === 'series') {
            const seasons = fetchedItem.streams.find(
              (s) => s.translatorId === nextState.translatorId,
            )!.seasons!
            let found = false
            for (const season of seasons) {
              for (const episode of season.episodes) {
                if (episode.stream) {
                  stream = episode.stream!
                  nextState.season = season.number
                  nextState.episode = episode.number
                  found = true
                  break
                }
              }
              if (found) break
            }
          } else {
            stream = fetchedItem.streams.find(
              (s) => s.translatorId === nextState.translatorId,
            )!.stream!
          }
          checkState(stream!, nextState)
          state.states[action.meta.arg.fullId.id] = nextState
          if (needToSave) {
            saveItemState(uid, action.meta.arg.fullId.id, nextState)
          }
          item.requestId = null
          item.state = FetchState.SUCCESS
          item.item = fetchedItem
          item.profile = profileItem
        }
      })
      .addCase(getItem.rejected, (state, action) => {
        const item = state.items.find((q) => q.requestId === action.meta.requestId)
        if (item && item.state === FetchState.LOADING) {
          item.requestId = null
          item.state = FetchState.ERROR
          if (action.error.code === '404') {
            item.error = {
              code: '404',
              name: '404',
              message: 'Title not found.',
            }
          } else {
            item.error = action.error
          }
        }
      })

    builder
      .addCase(updateTime.fulfilled, (state, action) => {
        const uid = action.payload.uid
        const timestamp = action.meta.arg.time
        const itemState = state.states[action.meta.arg.id]!
        if (itemState.timestamp !== timestamp) {
          itemState.timestamp = timestamp
          updateItemState(uid, action.meta.arg.id, { timestamp })
        }
      })
      .addCase(setSubtitle.fulfilled, (state, action) => {
        const uid = action.payload.uid
        const subtitle = action.meta.arg.subtitle
        const itemState = state.states[action.meta.arg.id]!
        if (itemState.subtitle !== subtitle) {
          itemState.subtitle = subtitle
          updateItemState(uid, action.meta.arg.id, { subtitle })
        }
      })
      .addCase(updateWatchItemProfile.fulfilled, (state, action) => {
        const item = state.items.find((i) => i.id === action.meta.arg.id)!
        if (item.profile) {
          const args = action.meta.arg
          if (typeof args.rating !== 'undefined') {
            item.profile.rating = args.rating
          }
          if (typeof args.favorite !== 'undefined') {
            item.profile.favorite = args.favorite
          }
          if (typeof args.saved !== 'undefined') {
            item.profile.saved = args.saved
          }
          if (typeof args.watched !== 'undefined') {
            item.profile.watched = args.watched
          }
        }
      })

    builder
      .addCase(switchEpisode.pending, switchPending)
      .addCase(switchEpisode.rejected, switchRejected('episode'))
      .addCase(switchEpisode.fulfilled, (state, action) => {
        const switchState = state.switchStates.find((s) => s.requestId === action.meta.requestId)
        if (switchState && switchState.state === SwitchState.LOADING) {
          const uid = action.payload.uid
          const update: UpdateItemStateArgs = {}
          const { id, season, episode } = action.meta.arg
          const itemState = state.states[id]!
          const item = state.items.find((i) => i.id === id)!.item! as ItemSeries
          const episodeStream = item.streams
            .find((s) => s.translatorId === itemState.translatorId)!
            .seasons!.find((s) => s.number === season)!
            .episodes.find((e) => e.number === episode)!
          let stream = action.payload.result
          if (!stream) {
            stream = episodeStream.stream!
          } else {
            episodeStream.stream = stream
          }
          checkState(stream, itemState, update)
          if (itemState.season !== season || itemState.episode !== episode) {
            itemState.timestamp = 0
            update.timestamp = 0
            itemState.season = season
            update.season = season
            itemState.episode = episode
            update.episode = episode
          }
          updateItemState(uid, id, update)

          switchState.state = SwitchState.IDLE
          switchState.requestId = null
        }
      })

    builder
      .addCase(switchTranslator.pending, switchPending)
      .addCase(switchTranslator.rejected, switchRejected('translator'))
      .addCase(switchTranslator.fulfilled, (state, action) => {
        const switchState = state.switchStates.find((s) => s.requestId === action.meta.requestId)
        if (switchState && switchState.state === SwitchState.LOADING) {
          const update: UpdateItemStateArgs = {}
          const { id, translatorId } = action.meta.arg
          const uid = action.payload.uid
          const payload = action.payload.result
          const item = state.items.find((i) => i.id === id)!.item!
          const itemState = state.states[id]!
          let stream: Stream
          if (payload.type === 'series') {
            const { stateTo, initial, next } = payload
            const translator = (item as ItemSeries).streams.find(
              (s) => s.translatorId === translatorId,
            )!
            if (initial) translator.seasons = initial
            const seasons = translator.seasons!
            if (next) {
              const { stream: nextStream, streamFor } = next
              const find = seasons
                .find((s) => s.number === streamFor.season)!
                .episodes.find((e) => e.number === streamFor.episode)!
              stream = find.stream = nextStream
            } else {
              stream = seasons
                .find((s) => s.number === stateTo.season)!
                .episodes.find((e) => e.number === stateTo.episode)!.stream!
            }
            if (itemState.season !== stateTo.season || itemState.episode !== stateTo.episode) {
              itemState.timestamp = 0
              update.timestamp = 0
              itemState.season = stateTo.season
              update.season = stateTo.season
              itemState.episode = stateTo.episode
              update.episode = stateTo.episode
            }
          } else {
            const translator = (item as ItemMovie).streams.find(
              (s) => s.translatorId === translatorId,
            )!
            if (payload.stream) translator.stream = payload.stream
            stream = translator.stream!
          }
          checkState(stream, itemState, update)
          if (itemState.translatorId !== translatorId) {
            itemState.translatorId = translatorId
            update.translatorId = translatorId
          }
          updateItemState(uid, id, update)

          switchState.state = SwitchState.IDLE
          switchState.requestId = null
        }
      })

    builder
      .addCase(switchQuality.pending, switchPending)
      .addCase(switchQuality.rejected, switchRejected('quality'))
      .addCase(switchQuality.fulfilled, (state, action) => {
        const switchState = state.switchStates.find((s) => s.requestId === action.meta.requestId)
        if (switchState && switchState.state === SwitchState.LOADING) {
          const { id } = action.meta.arg
          const uid = action.payload.uid
          state.states[action.meta.arg.id]!.quality = action.meta.arg.quality
          updateItemState(uid, id, { quality: action.meta.arg.quality })
          switchState.state = SwitchState.IDLE
          switchState.requestId = null
        }
      })

    builder
      .addCase(setProfileUser, (state, action) => {
        if (!action.payload) {
          state.states = {}
          state.items = []
          state.switchStates = []
        }
      })
      .addCase(getStreamDetails.fulfilled, (state, action) => {
        const stream = getItemStream(state, action.meta.arg)
        stream.detailsFetched = true
        stream.thumbnails.parse(action.payload.thumbnails)
        for (const size of action.payload.sizes) {
          const quality = stream.qualities.find((q) => q.id === size.id)!
          quality.downloadSize = size.downloadSize
          quality.downloadSizeStr = size.downloadSizeStr
        }
      })
  },
})

export const selectWatchItemOptional = (state: AppStoreState, id: number) =>
  state.watch.items.find((i) => i.id === id)
export const selectWatchItem = createSelector(selectWatchItemOptional, (item) => item!.item!)
export const selectWatchItemProfile = createSelector(
  selectWatchItemOptional,
  (item) => item!.profile!,
)
export const selectWatchItemSwitchState = (state: AppStoreState, id: number) =>
  state.watch.switchStates.find((s) => s.id === id)!
export const selectWatchItemFetchState = createSelector(
  selectWatchItemOptional,
  (item) => item!.state,
)
export const selectWatchItemError = createSelector(selectWatchItemOptional, (item) => item!.error)
export const selectWatchItemStates = (state: AppStoreState) => state.watch.states
export const selectWatchItemStateTranslatorId = (state: AppStoreState, id: number) =>
  state.watch.states[id]!.translatorId
export const selectWatchItemStateTimestamp = (state: AppStoreState, id: number) =>
  state.watch.states[id]!.timestamp
export const selectWatchItemStateQuality = (state: AppStoreState, id: number) =>
  state.watch.states[id]!.quality
export const selectWatchItemStateSeason = (state: AppStoreState, id: number) =>
  state.watch.states[id]!.season
export const selectWatchItemStateEpisode = (state: AppStoreState, id: number) =>
  state.watch.states[id]!.episode
export const selectWatchItemStateSubtitle = (state: AppStoreState, id: number) =>
  state.watch.states[id]!.subtitle
export const selectWatchItemStream = createSelector(
  selectWatchItem,
  selectWatchItemStateTranslatorId,
  selectWatchItemStateSeason,
  selectWatchItemStateEpisode,
  (item, translatorId, season, episode) => {
    if (item.itemType === 'series') {
      return item.streams
        .find((s) => s.translatorId === translatorId)!
        .seasons!.find((s) => s.number === season)!
        .episodes.find((e) => e.number === episode)!.stream!
    }
    return item.streams.find((s) => s.translatorId === translatorId)!.stream!
  },
)
export const selectWatchItemQualities = createSelector(
  selectWatchItemStream,
  (stream) => stream.qualities,
)
export const selectWatchItemQuality = createSelector(
  selectWatchItemQualities,
  selectWatchItemStateQuality,
  (qualities, quality) => qualities.find((q) => q.id === quality)!,
)
export const selectWatchItemTranslators = createSelector(
  selectWatchItem,
  (item) => item.translators,
)
export const selectWatchItemTranslator = createSelector(
  selectWatchItemTranslators,
  selectWatchItemStateTranslatorId,
  (translators, translatorId) => translators.find((t) => t.id === translatorId)!,
)
export const selectWatchItemSubtitles = createSelector(
  selectWatchItemStream,
  selectWatchItemStateSubtitle,
  (stream, subtitle) =>
    stream.subtitles
      .filter((s) => s.id !== null && s.title !== null && s.url !== null)
      .map(({ id, title, url }) => ({
        kind: 'subtitles',
        src: url!,
        srcLang: id!,
        label: title!,
        default: id === subtitle,
      })),
)
export const selectWatchItemThumbnails = createSelector(
  selectWatchItemStream,
  (stream) => stream.thumbnails,
)
export const selectWatchItemEpisodeTitle = createSelector(
  selectWatchItem,
  selectWatchItemStateTranslatorId,
  selectWatchItemStateSeason,
  selectWatchItemStateEpisode,
  (item, translatorId, season, episode) => {
    if (item.itemType === 'series') {
      const seasons = item.streams.find((s) => s.translatorId === translatorId)!.seasons!
      const currentSeason = seasons.find((s) => s.number === season)!
      const episodes = currentSeason.episodes
      const currentEpisode = episodes.find((e) => e.number === episode)!
      const episodeDetail =
        item.episodesInfo?.[currentSeason.number - 1]?.[currentEpisode.number - 1]
      return `S${currentSeason.number}:E${currentEpisode.number} «${episodeDetail?.title || `Эпизод ${currentEpisode.number}`}»`
    }
    return null
  },
)
export const selectWatchItemFullTitle = createSelector(
  selectWatchItem,
  selectWatchItemEpisodeTitle,
  (item, episodeTitle) => {
    if (episodeTitle) {
      return `${item.title} - ${episodeTitle}`
    }
    return item.title
  },
)
export const selectWatchItemFilename = createSelector(
  selectWatchItem,
  selectWatchItemStateSeason,
  selectWatchItemStateEpisode,
  (item, season, episode) => {
    let filename = item.originalTitle || item.title
    filename = transliterate(filename.replaceAll(' ', '_'))
    if (item.itemType === 'series') {
      filename += `_s${season}e${episode}`
    }
    return filename
  },
)
export const selectWatchItemPlaylist = createSelector(
  selectWatchItem,
  selectWatchItemStateTranslatorId,
  selectWatchItemStateSeason,
  selectWatchItemStateEpisode,
  (item, translatorId, stateSeason, stateEpisode) => {
    const franchise = item.franchise
    const playlist: WatchPlaylist = {
      title: franchise?.title || item.title,
      items: [],
    }

    const beforeFranchise: WatchPlaylistItemFranchise[] = []
    const seasons: WatchPlaylistItemSeason[] = []
    const afterFranchise: WatchPlaylistItemFranchise[] = []

    let currentFranchiseIndex = -1
    if (franchise) {
      let passedCurrent = false
      for (let i = 0; i < franchise.items.length; i++) {
        const item = franchise.items[i]
        if (item.isCurrent) {
          passedCurrent = true
          currentFranchiseIndex = i
          continue
        }
        const franchiseItem: WatchPlaylistItemFranchise = {
          type: 'franchise',
          title: item.title,
          to: `/watch/${item.typeId}/${item.genreId}/${item.slug}`,
          year: item.year,
          rating: item.rating,
        }
        if (passedCurrent) {
          afterFranchise.push(franchiseItem)
        } else {
          beforeFranchise.push(franchiseItem)
        }
      }
    }

    if (item.itemType === 'series') {
      const translatorSeasons = item.streams.find((t) => t.translatorId === translatorId)!.seasons!
      for (const season of translatorSeasons) {
        const seasonItem: WatchPlaylistItemSeason = {
          type: 'season',
          number: season.number,
          isCurrent: season.number === stateSeason,
          episodes: [],
        }
        const seasonIndex = season.number - 1
        for (const episode of season.episodes) {
          const episodeIndex = episode.number - 1
          const episodeDetail = item.episodesInfo?.[seasonIndex]?.[episodeIndex]
          seasonItem.episodes.push({
            type: 'episode',
            season: season.number,
            number: episode.number,
            title: `S${season.number}:E${episode.number} «${episodeDetail?.title || `Эпизод ${episode.number}`}»`,
            originalTitle: episodeDetail?.originalTitle || null,
            releaseDate: episodeDetail?.releaseDate || null,
            isCurrent: seasonItem.isCurrent && episode.number === stateEpisode,
          })
        }
        seasons.push(seasonItem)
      }
    } else if (franchise && currentFranchiseIndex !== -1) {
      const currentFranchiseItem = franchise.items[currentFranchiseIndex]
      beforeFranchise.push({
        type: 'franchise',
        title: item.title,
        to: `/watch/${item.typeId}/${item.genreId}/${item.slug}`,
        year: currentFranchiseItem.year,
        rating: currentFranchiseItem.rating,
        isCurrent: true,
      })
    }

    playlist.items = playlist.items.concat(beforeFranchise).concat(seasons).concat(afterFranchise)
    return playlist
  },
)
export const selectWatchItemPlaylistAdjacents = createSelector(
  selectWatchItemPlaylist,
  (playlist) => {
    const currentIndex = playlist.items.findIndex((i) => i.isCurrent)
    if (currentIndex === -1) {
      return { prev: null, next: null }
    }
    const current = playlist.items[currentIndex]
    if (current.type === 'season') {
      const episodeIndex = current.episodes.findIndex((i) => i.isCurrent)
      if (episodeIndex === -1) {
        return { prev: null, next: null }
      }
      let prev: WatchPlaylistPlayItem | null = null
      let next: WatchPlaylistPlayItem | null = null
      if (episodeIndex > 0) {
        prev = current.episodes[episodeIndex - 1]
      } else if (currentIndex > 0) {
        const prevPlaylistItem = playlist.items[currentIndex - 1]
        if (prevPlaylistItem.type === 'franchise') {
          prev = prevPlaylistItem
        } else {
          prev = prevPlaylistItem.episodes[prevPlaylistItem.episodes.length - 1]
        }
      }
      if (episodeIndex < current.episodes.length - 1) {
        next = current.episodes[episodeIndex + 1]
      } else if (currentIndex < playlist.items.length - 1) {
        const nextPlaylistItem = playlist.items[currentIndex + 1]
        if (nextPlaylistItem.type === 'franchise') {
          next = nextPlaylistItem
        } else {
          next = nextPlaylistItem.episodes[0]
        }
      }
      return { prev, next }
    } else {
      let prev: WatchPlaylistItem | null = null
      let next: WatchPlaylistItem | null = null
      if (currentIndex > 0) {
        prev = playlist.items[currentIndex - 1] as WatchPlaylistItemFranchise
      }
      if (currentIndex < playlist.items.length - 1) {
        next = playlist.items[currentIndex + 1] as WatchPlaylistItemFranchise
      }
      return { prev, next }
    }
  },
)

export const watchReducer = watchSlice.reducer
