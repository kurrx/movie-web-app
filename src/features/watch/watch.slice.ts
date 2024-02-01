import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { fetchItem, fetchSeriesStream } from '@/api'
import { FetchState, SwitchState } from '@/core'
import {
  AppStoreState,
  ItemFullID,
  ItemSeries,
  Stream,
  ThunkApiConfig,
  WatchItemState,
  WatchPlaylist,
  WatchPlaylistItemFranchise,
  WatchPlaylistItemSeason,
  WatchStoreState,
} from '@/types'

const initialState: WatchStoreState = {
  items: [],
  states: {},
  switchStates: [],
}

type GetItemReturnType = Awaited<ReturnType<typeof fetchItem>>
type GetItemParamType = ItemFullID
export const getItem = createAsyncThunk<GetItemReturnType, GetItemParamType, ThunkApiConfig>(
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

type SEReturnType = Awaited<ReturnType<typeof fetchSeriesStream>> | null
interface SEParamType {
  id: number
  season: number
  episode: number
}
export const switchEpisode = createAsyncThunk<SEReturnType, SEParamType, ThunkApiConfig>(
  'watch/switchEpisode',
  async ({ id, season, episode }, { signal, getState }) => {
    const item = getState().watch.items.find((i) => i.id === id)!.item! as ItemSeries
    const itemState = getState().watch.states[id]!
    const stream = item.streams
      .find((s) => s.translatorId === itemState.translatorId)!
      .seasons!.find((s) => s.number === season)!
      .episodes.find((e) => e.number === episode)!.stream
    if (stream) return null
    return await fetchSeriesStream({
      id,
      favsId: item.favsId,
      translatorId: itemState.translatorId,
      season,
      episode,
      signal,
    })
  },
  {
    condition(arg, api) {
      const switchState = api.getState().watch.switchStates.find((s) => s.id === arg.id)!
      return switchState.state !== SwitchState.LOADING
    },
  },
)

const watchSlice = createSlice({
  name: 'watch',
  initialState,

  reducers: {
    switchQuality(state, action: PayloadAction<{ id: number; quality: string }>) {
      state.states[action.payload.id]!.quality = action.payload.quality
    },

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
          const isQualityPresent = stream!.qualities.some((q) => q.id === nextState.quality)
          if (!isQualityPresent) {
            nextState.quality = stream!.defaultQuality
          }
          const isSubtitlePresent = stream!.subtitles.some((s) => s.id === nextState.subtitle)
          if (!isSubtitlePresent) {
            nextState.subtitle = stream!.defaultSubtitle
          }
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
      .addCase(switchEpisode.pending, (state, action) => {
        const switchState = state.switchStates.find((s) => s.id === action.meta.arg.id)
        if (!switchState) {
          state.switchStates.push({
            id: action.meta.arg.id,
            state: SwitchState.IDLE,
            error: null,
            requestId: null,
          })
        } else {
          switchState.state = SwitchState.LOADING
          switchState.error = null
          switchState.requestId = action.meta.requestId
        }
      })
      .addCase(switchEpisode.fulfilled, (state, action) => {
        const switchState = state.switchStates.find((s) => s.requestId === action.meta.requestId)
        if (switchState && switchState.state === SwitchState.LOADING) {
          const item = state.items.find((i) => i.id === action.meta.arg.id)!.item! as ItemSeries
          const itemState = state.states[action.meta.arg.id]!
          let stream = action.payload
          if (!stream) {
            stream = item.streams
              .find((s) => s.translatorId === itemState.translatorId)!
              .seasons!.find((s) => s.number === action.meta.arg.season)!
              .episodes.find((e) => e.number === action.meta.arg.episode)!.stream!
          }
          const isQualityPresent = stream.qualities.some((q) => q.id === itemState.quality)
          if (!isQualityPresent) {
            itemState.quality = stream.defaultQuality
          }
          const isSubtitlePresent = stream.subtitles.some((s) => s.id === itemState.subtitle)
          if (!isSubtitlePresent) {
            itemState.subtitle = stream.defaultSubtitle
          }
          itemState.timestamp = 0
          itemState.season = action.meta.arg.season
          itemState.episode = action.meta.arg.episode
          switchState.state = SwitchState.IDLE
          switchState.requestId = null
        }
      })
      .addCase(switchEpisode.rejected, (state, action) => {
        const switchState = state.switchStates.find((s) => s.requestId === action.meta.requestId)
        if (switchState && switchState.state === SwitchState.LOADING) {
          switchState.requestId = null
          switchState.state = SwitchState.ERROR
          switchState.error = {
            code: 'Switch Error',
            name: 'Switch Episode Error',
            message: 'Error while changing episode! Try again.',
          }
        }
      })
  },
})

export const { switchQuality, updateTime } = watchSlice.actions

export const selectWatchItemOptional = (state: AppStoreState, id: number) =>
  state.watch.items.find((i) => i.id === id)
export const selectWatchItem = createSelector(selectWatchItemOptional, (item) => item!.item!)
export const selectWatchItemFetchState = createSelector(
  selectWatchItemOptional,
  (item) => item!.state,
)
export const selectWatchItemError = createSelector(selectWatchItemOptional, (item) => item!.error)
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
      for (let i = franchise.items.length - 1; i >= 0; i--) {
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
            number: episode.number,
            title: `${episode.number}. ${episodeDetail?.title || 'Серия'}`,
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

    playlist.items.concat(beforeFranchise).concat(seasons).concat(afterFranchise)
    return playlist
  },
)

export const watchReducer = watchSlice.reducer
