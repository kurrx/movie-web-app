import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useMemo,
  useState,
} from 'react'
import ReactPlayer from 'react-player/file'

import { useContextWrapper } from '../hooks'

type Container = HTMLDivElement | null
type Content = HTMLDivElement | null
type Player = ReactPlayer | null
type Video = HTMLVideoElement | null

export interface PlayerNodes {
  container: Container
  setContainer: Dispatch<SetStateAction<Container>>

  content: Content
  setContent: Dispatch<SetStateAction<Content>>

  player: Player
  setPlayer: Dispatch<SetStateAction<Player>>

  video: Video
}

const PlayerNodesContext = createContext<PlayerNodes | null>(null)

export const useNodes = () => useContextWrapper(PlayerNodesContext, 'PlayerNodes')

export function PlayerNodesProvider({ children }: PropsWithChildren) {
  const [container, setContainer] = useState<Container>(null)
  const [content, setContent] = useState<Content>(null)
  const [player, setPlayer] = useState<Player>(null)
  const video = useMemo(() => (player?.getInternalPlayer() || null) as Video, [player])
  const context = useMemo<PlayerNodes>(
    () => ({ container, setContainer, content, setContent, player, setPlayer, video }),
    [container, content, player, video],
  )

  return <PlayerNodesContext.Provider value={context}>{children}</PlayerNodesContext.Provider>
}
