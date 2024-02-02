import { SwitchState, Thumbnails } from '@/core'
import {
  FetchableState,
  ItemTranslator,
  StreamQuality,
  WatchPlaylist,
  WatchPlaylistAdjacents,
  WatchPlaylistPlayItem,
} from '@/types'

export interface PlayerProps {
  title: string
  mediaUrl: string
  startTime: number
  switchState: FetchableState<SwitchState>
  playlist: WatchPlaylist
  playlistAdjacents: WatchPlaylistAdjacents
  quality: StreamQuality
  qualities: StreamQuality[]
  translator: ItemTranslator
  translators: ItemTranslator[]
  thumbnails: Thumbnails
  onTimeUpdate: (time: number) => void
  onSwitchRetry: () => void
  onPlayItem: (item: WatchPlaylistPlayItem) => void
  onTranslatorChange: (translatorId: number) => void
  onQualityChange: (quality: string) => void
}

export function Player(props: PlayerProps) {
  const {
    title,
    mediaUrl,
    startTime,
    switchState,
    playlist,
    playlistAdjacents,
    quality,
    qualities,
    translator,
    translators,
    thumbnails,
    onTimeUpdate,
    onSwitchRetry,
    onPlayItem,
    onTranslatorChange,
    onQualityChange,
  } = props

  return null
}
