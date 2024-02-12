import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Player } from '@/features/player'
import { useStore } from '@/hooks'
import { WatchPlaylistPlayItem } from '@/types'

import {
  getStreamDetails,
  preloadNextEpisode,
  selectWatchItemPlaylist,
  selectWatchItemPlaylistAdjacents,
  selectWatchItemQualities,
  selectWatchItemQuality,
  selectWatchItemStateTimestamp,
  selectWatchItemStream,
  selectWatchItemSwitchState,
  selectWatchItemThumbnails,
  selectWatchItemTitle,
  selectWatchItemTracks,
  selectWatchItemTranslator,
  selectWatchItemTranslators,
  switchEpisode,
  switchQuality,
  switchTranslator,
  updateTime,
} from '../watch.slice'

type SwitchAction = 'episode' | 'translator' | 'quality' | null
type SwitchEpisodeArgs = { id: number; season: number; episode: number }
type SwitchTranslatorArgs = { id: number; translatorId: number }
type SwitchQualityArgs = { id: number; quality: string }
type SwitchArgs = SwitchEpisodeArgs | SwitchTranslatorArgs | SwitchQualityArgs | null

export interface WatchPlayerProps {
  id: number
}

export function WatchPlayer({ id }: WatchPlayerProps) {
  const [dispatch, selector] = useStore()
  const navigate = useNavigate()
  const title = selector((state) => selectWatchItemTitle(state, id))
  const quality = selector((state) => selectWatchItemQuality(state, id))
  const qualities = selector((state) => selectWatchItemQualities(state, id))
  const mediaUrl = useMemo(() => quality.streamUrl, [quality])
  const startTime = selector((state) => selectWatchItemStateTimestamp(state, id))
  const switchState = selector((state) => selectWatchItemSwitchState(state, id))
  const playlist = selector((state) => selectWatchItemPlaylist(state, id))
  const playlistAdjacents = selector((state) => selectWatchItemPlaylistAdjacents(state, id))
  const translator = selector((state) => selectWatchItemTranslator(state, id))
  const translators = selector((state) => selectWatchItemTranslators(state, id))
  const tracks = selector((state) => selectWatchItemTracks(state, id))
  const thumbnails = selector((state) => selectWatchItemThumbnails(state, id))
  const stream = selector((state) => selectWatchItemStream(state, id))
  const [switchAction, setSwitchAction] = useState<SwitchAction>(null)
  const [switchArgs, setSwitchArgs] = useState<SwitchArgs>(null)

  const makeSwitch = useCallback(
    (action?: SwitchAction, args?: SwitchArgs) => {
      const nextAction = action || switchAction
      const nextArgs = args || switchArgs
      if (!nextArgs || !nextAction) return
      if (args) setSwitchArgs(args)
      if (action) setSwitchAction(action)
      switch (nextAction) {
        case 'episode':
          dispatch(switchEpisode(nextArgs as SwitchEpisodeArgs))
          break
        case 'translator':
          dispatch(switchTranslator(nextArgs as SwitchTranslatorArgs))
          break
        case 'quality':
          dispatch(switchQuality(nextArgs as SwitchQualityArgs))
          break
      }
    },
    [dispatch, switchAction, switchArgs],
  )
  const makeSwitchTranslator = useCallback(
    (translatorId: number) => {
      makeSwitch('translator', { id, translatorId })
    },
    [makeSwitch, id],
  )
  const makeSwitchEpisode = useCallback(
    (season: number, episode: number) => {
      makeSwitch('episode', { id, season, episode })
    },
    [makeSwitch, id],
  )
  const makeSwitchQuality = useCallback(
    (quality: string) => {
      makeSwitch('quality', { id, quality })
    },
    [makeSwitch, id],
  )

  const onTimeUpdate = useCallback(
    (time: number) => {
      dispatch(updateTime({ id, time }))
    },
    [dispatch, id],
  )
  const onPreloadNext = useCallback(() => {
    if (!playlistAdjacents.next) return
    if (playlistAdjacents.next.type === 'franchise') return
    const season = playlistAdjacents.next.season
    const episode = playlistAdjacents.next.number
    dispatch(preloadNextEpisode({ id, season, episode }))
  }, [dispatch, id, playlistAdjacents])
  const onSwitchRetry = useCallback(() => {
    makeSwitch()
  }, [makeSwitch])
  const onPlayItem = useCallback(
    (item: WatchPlaylistPlayItem) => {
      if (item.isCurrent) return
      if (item.type === 'franchise') {
        navigate(item.to, { replace: false })
      } else {
        makeSwitchEpisode(item.season, item.number)
      }
    },
    [navigate, makeSwitchEpisode],
  )
  const onTranslatorChange = useCallback(
    (translatorId: number) => {
      makeSwitchTranslator(translatorId)
    },
    [makeSwitchTranslator],
  )
  const onQualityChange = useCallback(
    (quality: string) => {
      makeSwitchQuality(quality)
    },
    [makeSwitchQuality],
  )

  useEffect(() => {
    const signal = dispatch(getStreamDetails(id))
    return () => {
      signal.abort()
    }
  }, [dispatch, stream, id])

  return (
    <Player
      title={title}
      mediaUrl={mediaUrl}
      startTime={startTime}
      switchState={switchState}
      playlist={playlist}
      playlistAdjacents={playlistAdjacents}
      quality={quality}
      qualities={qualities}
      translator={translator}
      translators={translators}
      tracks={tracks}
      thumbnails={thumbnails}
      onTimeUpdate={onTimeUpdate}
      onPreloadNext={onPreloadNext}
      onSwitchRetry={onSwitchRetry}
      onPlayItem={onPlayItem}
      onTranslatorChange={onTranslatorChange}
      onQualityChange={onQualityChange}
    />
  )
}
