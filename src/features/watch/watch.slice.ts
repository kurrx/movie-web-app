import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { fetchItem, fetchSeriesStream, fetchTranslator } from '@/api'
import { FetchState, SwitchState } from '@/core'
import {
  AppStoreState,
  ItemFullID,
  ItemMovie,
  ItemSeries,
  Stream,
  ThunkApiConfig,
  WatchItemState,
  WatchPlaylist,
  WatchPlaylistItem,
  WatchPlaylistItemFranchise,
  WatchPlaylistItemSeason,
  WatchPlaylistPlayItem,
  WatchStoreState,
} from '@/types'

import { getItemStates } from './watch.schemas'

type Thunk = ThunkApiConfig
type ThunkConditionApi = { getState: () => AppStoreState }
type GetItemReturn = Awaited<ReturnType<typeof fetchItem>>
type GetItemParam = ItemFullID
type SwitchParam = { id: number }
type SEpisodeReturn = Awaited<ReturnType<typeof fetchSeriesStream>> | null
type SEpisodeParam = { season: number; episode: number } & SwitchParam
type STranslatorReturn = Awaited<ReturnType<typeof fetchTranslator>>
type STranslatorParam = { translatorId: number } & SwitchParam
type SQualityReturn = Awaited<Promise<null>>
type SQualityParam = { quality: string } & SwitchParam
type SwitchAction = { meta: { arg: { id: number }; requestId: string } }

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
function checkState(stream: Stream, state: WatchItemState) {
  const isQualityPresent = stream.qualities.some((q) => q.id === state.quality)
  if (!isQualityPresent) {
    state.quality = stream.defaultQuality
  }
  const isSubtitlePresent = stream.subtitles.some((s) => s.id === state.subtitle)
  if (!isSubtitlePresent) {
    state.subtitle = stream.defaultSubtitle
  }
}

const initialState: WatchStoreState = {
  items: [],
  states: getItemStates(),
  switchStates: [],
}

export const getItem = createAsyncThunk<GetItemReturn, GetItemParam, Thunk>(
  'watch/getItem',
  async (fullId, { signal, getState }) => {
    const itemState = getState().watch.states[fullId.id]
    return await fetchItem({
      fullId,
      translatorId: itemState?.translatorId,
      season: itemState?.season,
      episode: itemState?.episode,
      signal,
    })
  },
  {
    condition(arg, api) {
      const items = api.getState().watch.items
      const findItem = items.find((i) => i.id === arg.id)
      if (!findItem) return true
      return findItem.state !== FetchState.SUCCESS
    },
  },
)

const switchOptions = {
  condition({ id }: SwitchParam, { getState }: ThunkConditionApi): boolean {
    const switchStates = getState().watch.switchStates
    const switchState = switchStates.find((s) => s.id === id)!
    return switchState.state !== SwitchState.LOADING
  },
}
export const switchEpisode = createAsyncThunk<SEpisodeReturn, SEpisodeParam, Thunk>(
  'watch/switchEpisode',
  async ({ id, season, episode }, { signal, getState }) => {
    const item = getState().watch.items.find((i) => i.id === id)!.item! as ItemSeries
    const state = getState().watch.states[id]!
    const stream = item.streams
      .find((s) => s.translatorId === state.translatorId)!
      .seasons!.find((s) => s.number === season)!
      .episodes.find((e) => e.number === episode)!.stream
    if (stream) return null
    return await fetchSeriesStream({
      id,
      favsId: item.favsId,
      translatorId: state.translatorId,
      season,
      episode,
      signal,
    })
  },
  switchOptions,
)
export const switchTranslator = createAsyncThunk<STranslatorReturn, STranslatorParam, Thunk>(
  'watch/switchTranslator',
  async ({ id, translatorId }, { signal, getState }) => {
    const item = getState().watch.items.find((i) => i.id === id)!.item!
    const state = getState().watch.states[id]!
    return await fetchTranslator({ item, translatorId, state, signal })
  },
  switchOptions,
)
export const switchQuality = createAsyncThunk<SQualityReturn, SQualityParam, Thunk>(
  'watch/switchQuality',
  async () => null,
  switchOptions,
)

const watchSlice = createSlice({
  name: 'watch',
  initialState,

  reducers: {
    updateTime(state, action: PayloadAction<{ id: number; time: number }>) {
      state.states[action.payload.id]!.timestamp = action.payload.time
    },
  },

  extraReducers(builder) {
    builder
      .addCase(getItem.pending, (state, action) => {
        const item = state.items.find((i) => i.id === action.meta.arg.id)
        if (!item) {
          state.items.push({
            id: action.meta.arg.id,
            state: FetchState.LOADING,
            error: null,
            requestId: action.meta.requestId,
            item: null,
          })
          state.switchStates.push({
            id: action.meta.arg.id,
            state: SwitchState.IDLE,
            error: null,
            requestId: null,
          })
        } else {
          item.state = FetchState.LOADING
          item.error = null
          item.requestId = action.meta.requestId
          item.item = null
        }
      })
      .addCase(getItem.fulfilled, (state, action) => {
        const item = state.items.find((i) => i.requestId === action.meta.requestId)
        if (item && item.state === FetchState.LOADING) {
          const fetchedItem = action.payload
          const currentState = state.states[action.meta.arg.id]
          const nextState =
            currentState ||
            ({
              translatorId: fetchedItem.translators[0].id,
              timestamp: 0,
              quality: 'auto',
              subtitle: 'null',
            } as WatchItemState)
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
          if (!currentState) {
            state.states[action.meta.arg.id] = nextState
          }
          item.requestId = null
          item.state = FetchState.SUCCESS
          item.item = fetchedItem
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
      .addCase(switchEpisode.pending, switchPending)
      .addCase(switchEpisode.rejected, switchRejected('episode'))
      .addCase(switchEpisode.fulfilled, (state, action) => {
        const switchState = state.switchStates.find((s) => s.requestId === action.meta.requestId)
        if (switchState && switchState.state === SwitchState.LOADING) {
          const { id, season, episode } = action.meta.arg
          const itemState = state.states[id]!
          const item = state.items.find((i) => i.id === id)!.item! as ItemSeries
          const episodeStream = item.streams
            .find((s) => s.translatorId === itemState.translatorId)!
            .seasons!.find((s) => s.number === season)!
            .episodes.find((e) => e.number === episode)!
          let stream = action.payload
          if (!stream) {
            stream = episodeStream.stream!
          } else {
            episodeStream.stream = stream
          }
          checkState(stream, itemState)
          itemState.timestamp = 0
          itemState.season = season
          itemState.episode = episode

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
          const { id, translatorId } = action.meta.arg
          const payload = action.payload
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
            }
            itemState.season = stateTo.season
            itemState.episode = stateTo.episode
          } else {
            const translator = (item as ItemMovie).streams.find(
              (s) => s.translatorId === translatorId,
            )!
            if (payload.stream) translator.stream = payload.stream
            stream = translator.stream!
          }
          checkState(stream, itemState)
          itemState.translatorId = translatorId

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
          state.states[action.meta.arg.id]!.quality = action.meta.arg.quality
          switchState.state = SwitchState.IDLE
          switchState.requestId = null
        }
      })
  },
})

export const { updateTime } = watchSlice.actions

export const selectWatchItemOptional = (state: AppStoreState, id: number) =>
  state.watch.items.find((i) => i.id === id)
export const selectWatchItem = createSelector(selectWatchItemOptional, (item) => item!.item!)
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
export const selectWatchItemThumbnails = createSelector(
  selectWatchItemStream,
  (stream) => stream.thumbnails,
)
export const selectWatchItemTitle = createSelector(
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
      return `${item.title}: ${currentSeason.title} ${currentEpisode.title}`
    }
    return item.title
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
            title: `S${season.number}:E${episode.number} «${episodeDetail?.title || `Episode ${episode.number}`}»`,
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
