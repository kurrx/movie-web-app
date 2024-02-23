import { createContext, PropsWithChildren } from 'react'

import { SwitchState, Thumbnails } from '@/core'
import {
  FetchableState,
  ItemTrack,
  ItemTranslator,
  StreamQuality,
  WatchPlaylist,
  WatchPlaylistAdjacents,
  WatchPlaylistPlayItem,
} from '@/types'

import { useContextWrapper } from '../hooks'

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
  subtitle: string | null
  subtitles: ItemTrack[]
  thumbnails: Thumbnails
  onTimeUpdate: (time: number, duration: number) => void
  onPreloadNext: () => void
  onSwitchRetry: () => void
  onPlayItem: (item: WatchPlaylistPlayItem) => void
  onTranslatorChange: (translatorId: number) => void
  onSubtitleChange: (subtitle: string | null) => void
  onQualityChange: (quality: string) => void
}

const PlayerPropsContext = createContext<PlayerProps | null>(null)

export const useProps = () => useContextWrapper(PlayerPropsContext, 'PlayerProps')

export interface PlayerPropsProviderProps extends PlayerProps, PropsWithChildren {}

export function PlayerPropsProvider({ children, ...value }: PlayerPropsProviderProps) {
  return <PlayerPropsContext.Provider value={value}>{children}</PlayerPropsContext.Provider>
}
