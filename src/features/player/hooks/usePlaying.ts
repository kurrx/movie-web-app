import { useCallback } from 'react'

import { useStore } from '@/hooks'

import { useNodes } from '../components/PlayerNodes'
import {
  selectPlayerEnded,
  setPlayerPlaying,
  setPlayerPlayingWithAction,
  startReplay,
  startReplayWithAction,
} from '../player.slice'

export function usePlaying() {
  const [dispatch, selector] = useStore()
  const { player } = useNodes()
  const ended = selector(selectPlayerEnded)

  const replay = useCallback(
    (withAction: boolean) => {
      if (!player) return
      player.seekTo(0, 'seconds')
      if (withAction) {
        dispatch(startReplayWithAction())
      } else {
        dispatch(startReplay())
      }
    },
    [dispatch, player],
  )
  const togglePlaying = useCallback(
    (withAction: boolean) => {
      if (ended) {
        replay(withAction)
      } else {
        if (withAction) {
          dispatch(setPlayerPlayingWithAction((prev) => !prev))
        } else {
          dispatch(setPlayerPlaying((prev) => !prev))
        }
      }
    },
    [dispatch, replay, ended],
  )
  const onClick = useCallback(() => togglePlaying(false), [togglePlaying])
  const onKeyClick = useCallback(() => togglePlaying(true), [togglePlaying])

  return { replay, togglePlaying, onClick, onKeyClick }
}
